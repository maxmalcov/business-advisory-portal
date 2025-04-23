
-- Create a function to handle subscription type creation with validation
CREATE OR REPLACE FUNCTION create_subscription_type(
  p_name TEXT,
  p_description TEXT,
  p_type_id TEXT,
  p_icon_type TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the user is an admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can create subscription types';
  END IF;

  -- Insert the new subscription type
  INSERT INTO public.subscription_types (
    name,
    description,
    type_id,
    icon_type,
    status
  ) VALUES (
    p_name,
    p_description,
    p_type_id,
    p_icon_type,
    'active'
  );
END;
$$;
