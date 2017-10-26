Application.ensure_all_started(:fred_content)
ExUnit.configure(exclude: [integration: true])
ExUnit.start()
