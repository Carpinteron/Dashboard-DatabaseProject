-- num vuelos por a�o
select f.year, count(*) as Cant_Vuelos
from Flights_US f
group by f.year
order by year asc