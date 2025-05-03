-- precios promedio por año
select year(f.date) as year, avg(cast(f.fare as float)) as Precio_Promedio
from Flights_US f
group by year(f.date)
order by year(f.date) asc