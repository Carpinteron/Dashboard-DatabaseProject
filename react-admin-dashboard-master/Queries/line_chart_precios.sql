-- precios promedio por a�o
select year(f.date) as A�o, avg(f.fare) as Precio_Promedio
from Flights_US f
group by year(f.date)
order by year(f.date) asc