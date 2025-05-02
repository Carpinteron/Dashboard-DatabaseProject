-- cambios en las 5 rutas (segun aeropuerto de origen - destino) mas populares en general por año
with rutas_populares as(
select top 5 f.airport1 as origen, f.airport2 as destino, sum(f.passengers) as Total_Pasajeros_Ruta
from Flights_US f
group by f.airport1, f.airport2
order by Total_Pasajeros_Ruta desc
)
select year(f.date) as Año, r.origen as Origen, r.destino as Destino, sum(f.passengers) as Cant_Pasajeros_Anual, r.Total_Pasajeros_Ruta
from Flights_US f
join rutas_populares r on r.origen=f.airport1 and r.destino=f.airport2
group by year(f.date), r.origen, r.destino, r.Total_Pasajeros_Ruta
order by year(f.date), Total_Pasajeros_Ruta desc