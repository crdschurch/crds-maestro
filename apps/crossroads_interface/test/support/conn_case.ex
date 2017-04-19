defmodule CrossroadsInterface.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  imports other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest

      import CrossroadsInterface.Router.Helpers

      # The default endpoint for testing
      @endpoint CrossroadsInterface.Endpoint

      def fake_content_blocks() do
        %{"contentBlocks" => [%{"id" => 1, "title" => "generalError"}]}
      end

      def fake_system_page(stateName) do
        %{"systemPages" => [%{"bodyClasses" => nil,
                                              "card" => "summary",
                                              "className" => "SystemPage",
                                              "created" => "2015-09-24T13:52:49-04:00",
                                              "description" => "We are glad you are here. Let's get your account set up!",
                                              "id" => 59,
                                              "keywords" => nil,
                                              "legacyStyles" => "1",
                                              "stateName" => stateName,
                                              "title" => "Register",
                                              "type" => "website",
                                              "uRL" => "/register"}]}
      end
    end
  end

  setup tags do

    {:ok, conn: Phoenix.ConnTest.conn()}
  end
end
