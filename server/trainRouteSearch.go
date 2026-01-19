package main

import (
	"container/heap"
)

func SearchTrainRoute(item TransportSearchItem, targets []*OSMTransportStop, queue *TransportSearchQueue) (*TransportSearchItem, error) {
	target_center := Center(targets)
	last_stop := item.CurrentTrip[len(item.CurrentTrip)-1]
	last_dist := item.Distances[len(item.Distances)-1]
	//best_distance := Haversine(last_stop.Latitude(), last_stop.Longtitude(), target_center[0], target_center[1])
	possible_stops, err := GetNamedStations(last_stop.Tags.Name)
	if err != nil {
		return nil, err
	}
	for _, stop := range *possible_stops {
		reachable_stops, err := GetAllReachableStations(stop)
		if err != nil {
			return nil, err
		}
		for _, stop := range *reachable_stops {
			stop_distance := Haversine(stop.Latitude(), stop.Longtitude(), target_center[0], target_center[1])
			if stop.OsmID() == last_stop.OsmID() || stop_distance*1.2 > last_dist {
				continue
			}
			trip := make([]OSMTransportStop, len(item.CurrentTrip))
			copy(trip, item.CurrentTrip)
			trip = append(trip, stop)

			dsts := make([]float64, len(item.Distances))
			copy(dsts, item.Distances)
			dsts = append(dsts, stop_distance)
			newItem := TransportSearchItem{CurrentTrip: trip, Distances: dsts}

			for _, tgt := range targets {
				if stop.OsmID() == tgt.OsmID() {
					return &newItem, nil
				}
			}
			heap.Push(queue, &newItem)
			/* if stop.OsmID() != last_stop.OsmID() && Haversine(stop.Latitude(), stop.Longtitude(), target_center[0], target_center[1]) < best_distance {
				queue = append(queue, stop)
			} */
		}

	}
	return nil, nil

}
