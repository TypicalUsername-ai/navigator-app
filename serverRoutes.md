# github.com/TypicalUsername-ai/navigator-app/server

Navigator app docs

## Routes

<details>
<summary>`/city/list`</summary>

- [RequestID]()
- [Logger]()
- [Recoverer]()
- [URLFormat]()
- [main.main.SetContentType.func2]()
- **/city**
	- **/list**
		- _GET_
			- [main.GetSupportedCities]()

</details>
<details>
<summary>`/city/{cityName}/parking/all`</summary>

- [RequestID]()
- [Logger]()
- [Recoverer]()
- [URLFormat]()
- [main.main.SetContentType.func2]()
- **/city**
	- **/{cityName}**
		- **/parking**
			- [main.CitiesCtx]()
			- **/all**
				- _GET_
					- [main.CitiesCtx]()
					- [main.GetCityParking]()

</details>
<details>
<summary>`/city/{cityName}/trains/stops`</summary>

- [RequestID]()
- [Logger]()
- [Recoverer]()
- [URLFormat]()
- [main.main.SetContentType.func2]()
- **/city**
	- **/{cityName}**
		- **/trains**
			- **/stops**
				- _GET_
					- [main.GetRailwayStops]()

</details>
<details>
<summary>`/city/{cityName}/transport/stops`</summary>

- [RequestID]()
- [Logger]()
- [Recoverer]()
- [URLFormat]()
- [main.main.SetContentType.func2]()
- **/city**
	- **/{cityName}**
		- **/transport**
			- [main.CitiesCtx]()
			- **/stops**
				- _GET_
					- [main.CitiesCtx]()
					- [main.GetCityStops]()

</details>

Total # of routes: 4

