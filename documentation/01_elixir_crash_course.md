# Elixir Syntax Crash Course

- Returns in elixir are implicit and are based on the last evaluated line
  within a function body. For example:

  ```
  def add_two(num) do
    num + 2
  end
  ```

  It is not necessary to use the `return` keyword to have a value returned from
  the invocation of `add_two`.
- Primitive Data types include:
  - Boolean (true/false)
  - Atoms (a constant whose name is its own value)
  - Strings (delimited by double quotes, _not single quotes_)
  - Lists (similar to arrays in JavaScript or Ruby. They can hold any value(s))
  - Tuples (delineated by `{}`, and typically the first element is an
    atom)
- Non Primitive Data types:
  - Map (the go to key-value store, delineated by `%{}`)
  - Keyword Lists (A list of 2 element tuples `[{:a, 24}, {:b, 37}]`)
- Pattern matching is a huge part of the Elixir programming language. Take the
  following example:

  `a = 1`

  In most languages, this would be viewed as a variable assignment, but Elixir
  looks at this statement and makes the left side equal the right side. The
  difference is subtle, but important. Let's take a more complex example:

  ```
  my_tuple = {:a, 27, %{"hello"=>"world"}, true}
  {foo, bar, baz, shiz} = my_tuple
  foo == :a // true
  bar == 27 // true
  baz == %{"hello"=>"world"} // true
  shiz == true // true
  foo == "not correct" // false
  ```

This is intended to be a very basic introduction to the Elixir programming
language. To learn more, please [read here](https://elixir-lang.org/).
