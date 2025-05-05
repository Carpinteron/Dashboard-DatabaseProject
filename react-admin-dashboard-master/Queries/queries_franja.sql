-- cantidad de vuelos
select count(*) as totalvuelos
from Flights_US f

-- distancia recorrida promedio
select avg(cast(f.nsmiles as float)) as avgdistancia
from Flights_US f

-- total aeropuertos
select count(distinct f.airport1) + count(distinct f.airport2) as totalaeropuertos
from Flights_US f

-- precio promedio
select avg(cast(f.fare as float)) as avgprecio
from Flights_US f

