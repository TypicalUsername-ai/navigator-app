package main

import (
	"container/heap"
)

func SearchCityRoute(item TransportSearchItem, targets []*OSMTransportStop, city string, queue *TransportSearchQueue, nameCache *map[string][]*OSMTransportStop) (*TransportSearchItem, error) {
	target_center := Center(targets)
	last_stop := item.CurrentTrip[len(item.CurrentTrip)-1]

	//best_distance := Haversine(last_stop.Latitude(), last_stop.Longtitude(), target_center[0], target_center[1])

	last_stop_name := TrimStopSuffix(last_stop.Tags.Name)
	possible_stops := (*nameCache)[last_stop_name]
	for _, stop := range possible_stops {
		reachable_stops, err := GetAllReachableStops(*stop)
		if err != nil {
			return nil, err
		}
		for _, stop := range *reachable_stops {
			if stop.OsmID() == last_stop.OsmID() {
				continue
			}
			trip := make([]OSMTransportStop, len(item.CurrentTrip))
			copy(trip, item.CurrentTrip)
			trip = append(trip, stop)

			dsts := make([]float64, len(item.Distances))
			copy(dsts, item.Distances)
			dsts = append(dsts, Haversine(stop.Latitude(), stop.Longtitude(), target_center[0], target_center[1]))
			newItem := TransportSearchItem{CurrentTrip: trip, Distances: dsts}
			for _, tgt := range targets {
				if stop.OsmID() == tgt.OsmID() {
					return &newItem, nil
				}
			}
			heap.Push(queue, &newItem)
		}

	}
	return nil, nil

}
