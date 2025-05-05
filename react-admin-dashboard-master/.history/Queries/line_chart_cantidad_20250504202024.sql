-- cantidad de vuelos por a�o
select year(f.date) as Ao, count(*) as Cant_Vuelos
from Flights_US f
group by year(f.date)
order by year(f.date) asc