# コードのテスト用ファイル

### インライン

- `inline code`
- `print([*array])`
- `console.log(location)`
- `fmt.println("Hello, World!")`

## ブロック

### テキスト

```plaintext
Hello, World!
```

### Shell

```bash
sudo apt-get update
# sudo apt-get upgrade
```

### JavaScript

```javascript
window.onload = () => {
  console.log("Onload!");
  document.getElementById("app").innerHTML = "Hello, World!";
};
```

### TypeScript

```typescript
import Express from "express";
type User = {
  name: string;
  age: number;
};

const users: User[] = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 30 },
];

const app = Express();
app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server started!");
});
```

### JSX

```jsx
import React from "react";

const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### Python

```python
import numpy as np
import matplotlib.pyplot as plt

def main():
    x = np.linspace(0, 2 * np.pi, 100)
    y = np.sin(x)
    plt.plot(x, y)
    plt.show()

if __name__ == "__main__":
    main()
```

### Go

```go
package main
import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
