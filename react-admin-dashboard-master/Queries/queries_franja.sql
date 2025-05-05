-- cantidad de vuelos
select count(*) as totalvuelos
from Flights_US f

-- distancia recorrida promedio
select avg(cast(f.nsmiles as float)) as avgdistancia
from Flights_US f

-- total aeropuertos
with Aeropuertos as (
    select f.airport1 as aeropuerto
	from Flights_US f
    union 
    select f.airport2 
	from Flights_US f
)
select count(*) totalaeropuertos
from Aeropuertos;

-- precio promedio
select avg(cast(f.fare as float)) as avgprecio
from Flights_US f

