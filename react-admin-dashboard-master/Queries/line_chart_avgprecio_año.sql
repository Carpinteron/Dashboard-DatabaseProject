-- precio promedio anual de las rutas mas concurridas
with rutas_concurridas as(    
	SELECT top 10 f.airport1 AS origen, f.airport2 AS destino, count(*) as cant
    FROM Flights_US f
    GROUP BY f.airport1, f.airport2
    ORDER BY cant DESC
)
select year(f.date) as year, rc.origen, rc.destino, avg(cast(f.fare as float)) as Precio_Promedio_Anual
from rutas_concurridas rc
join Flights_US f on f.airport1=rc.origen and f.airport2=rc.destino
group by year(f.date), rc.origen, rc.destino
order by year(f.date)