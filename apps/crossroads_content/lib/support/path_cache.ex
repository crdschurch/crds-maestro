defmodule CrossroadsContent.PathCache do
  @moduledoc """
  Holds the data for a particular call to the CMS and when it
  is no longer valid.
  """
  defstruct path: nil, timeout: DateTime.utc_now(), data: {}
end
