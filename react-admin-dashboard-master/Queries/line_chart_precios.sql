-- precios promedio por a�o
select f.year, avg(f.fare) as Precio_Promedio
from Flights_US f
group by f.year
order by year asc