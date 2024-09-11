import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

interface PokeData {
  sprites: {
    front_default: string;
  }
  name: string;
    types: {
    type: {
      name: string;
    };
  }[];
}

function App() {
  const [, setGetAllData] = useState([]);
  const [getNext, setGetNext] = useState<string | null>(null); // 初期値をnullに設定
  const [, setGetPrev] = useState<string | null>(null); // 初期値をnullに設定
  const [getDetailData, setGetDetailData] = useState<PokeData[]>([]);
 
  useEffect(() => {
    const allPokemonData = async () => {
      try {
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon")
        const allData = res.data.results;
        setGetAllData(res.data.results);
        setGetNext(res.data.next);
        setGetPrev(res.data.previous);

    const detailData = await Promise.all(
      allData.map(async (data: { url: string }) => {
        const res2 = await axios.get(data.url);
        return res2.data;  // 取得したデータを集約してPromise.allが返す
      })
    );
    setGetDetailData(detailData)
      } catch {
        console.error("失敗しました")
      }
    }
    allPokemonData();
  }, [])

  const clickNext = async () => {
    try {
      if (getNext) { // getNext がnullでないことを確認
        const res = await axios.get(getNext); // getNext の URL にリクエスト
        const nextData = res.data; // レスポンスデータ全体を取得

        const detailData = await Promise.all(
          nextData.results.map(async (data: { url: string }) => {
            const res2 = await axios.get(data.url);
            return res2.data; // 取得したデータを返す
          })
        );

        setGetDetailData(detailData); // 取得した詳細データを状態に保存
        setGetNext(nextData.next); // 次のページのURLをセット
        setGetPrev(nextData.previous); // 前のページのURLをセット
      }
    } catch (error) {
      console.error("次のページのデータ取得に失敗しました", error);
    }
  };

  const clickPrev = () => {

  }

  return (
    <>
      <ul>
        {getDetailData.map((data) => {
          return(
            <li key={data.name}>
              <img src={data.sprites.front_default} alt="画像"></img>
              <p>{data.name}</p>
              <p>{data.types.map((object) => object.type.name).join(',')}</p>
            </li>
          )
        })}
      </ul>
      <button type="button" onClick={clickNext}>次へ</button>
      <button type="button" onClick={clickPrev}>前へ</button>
    </>
  )
}

export default App
