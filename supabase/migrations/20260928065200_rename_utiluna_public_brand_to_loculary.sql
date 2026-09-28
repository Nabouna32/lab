-- Rename the current public brand in persisted tool editorial/SEO content.
-- Historical audit data and infrastructure/project names are intentionally unchanged.

update public.tool_translations
set name = replace(name, 'Utiluna', 'Loculary'),
    description = replace(description, 'Utiluna', 'Loculary'),
    seo_title = replace(seo_title, 'Utiluna', 'Loculary'),
    seo_description = replace(seo_description, 'Utiluna', 'Loculary'),
    updated_at = now()
where name like '%Utiluna%'
   or description like '%Utiluna%'
   or seo_title like '%Utiluna%'
   or seo_description like '%Utiluna%';
