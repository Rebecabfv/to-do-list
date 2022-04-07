import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { fakeApi } from "./services/fakeApi";
import axios from "axios";

function App() {
  type Product = {
    id: number;
    name: string;
  };

  type CreateProduct = {
    id?: number;
    name: string;
  };

  type DeleteProduct = {
    id: number;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productNameInput, setProductNameInput] = useState("");
  const [idInput, setIdInput] = useState(0);
  const [activities, setActivities] = useState(" ");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  async function handleGetActivity() {
    setIsLoadingProfile(true);

    try {
      const typeOfActivity = "recreational";
      const baseUrl = "http://www.boredapi.com/api/activity";

      const response = await fetch(`${baseUrl}?type=${typeOfActivity}`, {
        method: "GET",
      });
      const activities = await response.json();

      setActivities(activities.activity);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function getProducts() {
    const response = await fakeApi.get("products");

    const fakeProducts = response.data;

    setProducts(fakeProducts);
  }

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: CreateProduct = {
      name: productNameInput,
    };

    if (!data.name) {
      alert("Nome ou valor do produto faltando...");
      return;
    }

    const response = await fakeApi.post("products", data);

    const fakeProduct = response.data;

    setProducts((previousState) => [...previousState, fakeProduct]);
    setProductNameInput("");
  }

  async function deleteProduct(idInput: number) {
    await fakeApi.delete(`products/${idInput}`);

    setProducts((previousState) =>
      previousState.filter((product) => product.id !== idInput)
    );
    setIdInput(0);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="App">
      <h1>Tasks</h1>

      <form onSubmit={createProduct}>
        <label htmlFor="product-name">Tasks</label>
        <input
          type="text"
          id="product-name"
          value={productNameInput}
          onChange={(event) => setProductNameInput(event.target.value)}
        />

        <button type="submit">Add tasks</button>
      </form>

      <h2>Produtos</h2>

      <ul className="products">
        {products.map((product) => (
          <li key={product.id}>
            <p>{product.name}</p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h1>Essa é a atividade randomica gerada: </h1>
      {isLoadingProfile && (
        <h2>Aguarde... estamos buscando algo interessante para você</h2>
      )}
      {!isLoadingProfile && <h2>{activities}</h2>}
      <button onClick={handleGetActivity}>Alterar atividade</button>
    </div>
  );
}

export default App;
