import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

interface Sprites {
  front_default: string;
}

interface PokemonCard {
  img: HTMLImageElement;
  name: string;
  types: PokemonType[];  // PokemonType型の配列
  sprites: Sprites;      // Sprites型
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setPokeData] = useState<Pokemon[]>([]); // ポケモンの基本データを格納
  const [details, setDetails] = useState<PokemonCard[]>([]); // 詳細データを格納

  useEffect(() => {
    const getData = async () => {
      try {
        // まずポケモンのリストを取得
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon');
        const allPokeData: Pokemon[] = res.data.results; // 基本データ
        setPokeData(allPokeData); // pokeDataに基本データをセット

        // 取得したポケモンリストから各ポケモンの詳細を取得
        const detailPromises = allPokeData.map(async (data) => {
          const res2 = await axios.get(data.url);
          return res2.data; // 詳細データを返す
        });

        // 全ての詳細データが取得されるまで待つ
        const allDetails = await Promise.all(detailPromises);
        setDetails(allDetails); // detailsに詳細データをセット
        setIsLoading(false); // ローディング終了
      } catch (error) {
        console.error('データ取得エラー:', error);
        setIsLoading(false); // エラー時もローディング終了
      }
    };

    getData();
  }, []);

  return (
    <>
      {isLoading? 
      <p>ロード中…</p>:

      <ul>
        {details.map((data) => (
          <li key={data.name}>
            <img src={data.sprites.front_default} alt="画像"></img>
            <p>{data.name}</p>
            <p>{data.types.map((typeObj) => typeObj.type.name).join(', ')}</p>
          </li>
        ))}
      </ul>}
    </>
  )
}

export default App
