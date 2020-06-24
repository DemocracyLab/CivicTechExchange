-- Reverses project lat/long coordinates, as they were set in reversed order initially

UPDATE
    civictechprojects_project
SET
    project_location_coords = st_geometryfromtext('POINT('|| ST_Y(project_location_coords) ||' '|| ST_X(project_location_coords) ||')', 4326);
