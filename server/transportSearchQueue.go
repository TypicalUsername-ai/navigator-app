package main

import (
	"math"
)

type TransportSearchItem struct {
	CurrentTrip []OSMTransportStop
	Distances   []float64
	index       int
}

func (i *TransportSearchItem) astar() float64 {
	var cost float64
	approx_dist := i.Distances[len(i.Distances)-1]
	for ind := range len(i.Distances) - 2 {
		cost += math.Abs(i.Distances[ind] - i.Distances[ind+1])
	}

	return cost + approx_dist
}

type TransportSearchQueue []*TransportSearchItem

func (tsq TransportSearchQueue) Len() int { return len(tsq) }

func (tsq TransportSearchQueue) Less(i, j int) bool { return tsq[i].astar() < tsq[j].astar() }

func (tsq TransportSearchQueue) Swap(i, j int) {
	tsq[i], tsq[j] = tsq[j], tsq[i]
	tsq[i].index = j
	tsq[j].index = i
}

func (tsq *TransportSearchQueue) Push(x any) {
	n := len(*tsq)
	item := x.(*TransportSearchItem)
	item.index = n
	*tsq = append(*tsq, item)
}

func (tsq *TransportSearchQueue) Pop() any {
	old := *tsq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	item.index = -1
	*tsq = old[0 : n-1]
	return item
}
