-- cantidad de vuelos
select count(*) as Total_Vuelos
from Flights_US f

-- distancia recorrida promedio
select avg(cast(nsmiles as float)) as Distancia_Promedio
from Flights_US f

-- total aeropuertos
select count(distinct f.airport1) + count(distinct f.airport2) as Total_Aeropuertos
from Flights_US f

-- precio promedio
select avg(cast(f.fare as float)) as Precio_Promedio
from Flights_US f

