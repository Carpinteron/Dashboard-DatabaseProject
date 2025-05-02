-- distancias vs cantidad
select
    case
        when f.nsmiles < 10000 then '0-10000'
        when f.nsmiles between 10000 and 20000 then '10000-20000'
        else '20000+'  
    end as Rango_Dist,
    count(*) as Cant_Vuelos
from Flights_US f
group by
    case
        when f.nsmiles < 10000 then '1'
        when f.nsmiles between 10000 and 20000 then '2'
        else '3' 
	end,
    case
        when f.nsmiles < 10000 then '0-10000'
        when f.nsmiles between 10000 and 20000 then '10000-20000'
        else '20000+' 
    end
order by
    case
        when f.nsmiles < 10000 then '1'
        when f.nsmiles between 10000 and 20000 then '2'
        else '3' 
	end