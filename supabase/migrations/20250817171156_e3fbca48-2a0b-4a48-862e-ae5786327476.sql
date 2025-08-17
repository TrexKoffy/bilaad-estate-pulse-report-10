-- Remove the restrictive type check constraint to allow free-text input
ALTER TABLE public.units DROP CONSTRAINT units_type_check;

-- Add a more flexible constraint that just ensures the type is not empty
ALTER TABLE public.units ADD CONSTRAINT units_type_not_empty_check CHECK (length(trim(type)) > 0);