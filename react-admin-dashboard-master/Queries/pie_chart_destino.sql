-- ciudades mas visitadas
select top 5 f.city2, sum(f.passengers) as Cant_Pasajeros
from Flights_US f
where f.city2!=''
group by f.city2
order by Cant_Pasajeros desc