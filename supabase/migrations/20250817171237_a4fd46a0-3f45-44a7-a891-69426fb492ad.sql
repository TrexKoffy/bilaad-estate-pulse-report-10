-- Remove the restrictive type check constraint to allow free-text input
DROP CONSTRAINT IF EXISTS units_type_check CASCADE;

-- Add a more flexible constraint that just ensures the type is not empty
ALTER TABLE public.units ADD CONSTRAINT units_type_not_empty_check CHECK (length(trim(type)) > 0);