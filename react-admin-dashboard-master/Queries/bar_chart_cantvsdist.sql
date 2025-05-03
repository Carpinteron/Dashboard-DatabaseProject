-- distancias vs cantidad
select
    case
        when cast(f.nsmiles as float) < 1000 then '0-1000'
        when cast(f.nsmiles as float) between 1000 and 2000 then '1000-2000'
        else '2000+'  
    end as Rango_Dist,
    count(*) as Cant_Vuelos
from Flights_US f
group by
    case
        when cast(f.nsmiles as float) < 1000 then '1'
        when cast(f.nsmiles as float) between 1000 and 2000 then '2'
        else '3' 
	end,
    case
        when cast(f.nsmiles as float) < 1000 then '0-1000'
        when cast(f.nsmiles as float) between 1000 and 2000 then '1000-2000'
        else '2000+' 
    end
order by
    case
        when cast(f.nsmiles as float) < 1000 then '1'
        when cast(f.nsmiles as float) between 1000 and 2000 then '2'
        else '3' 
	end