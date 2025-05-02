-- ciudades de las que mas se sale
select top 5 f.city1, sum(f.passengers) as Cant_Pasajeros
from Flights_US f
where f.city1!=''
group by f.city1
order by Cant_Pasajeros desc