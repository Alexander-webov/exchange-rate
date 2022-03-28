import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';
import Appitem from './componets/AppItem';

function App() {
  const [items, setItems] = useState([]);
  const [itemsTenDays, setItemsTenDays] = useState([]);


  useEffect(() => {
    axios.get('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(({ data }) => {
        const items = [];
        for (const key in data.Valute) {
          items.push(data.Valute[key]);
        }
        setItems(items);
      })
  }, []);

  const date = new Date();
  const dateMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth()}`;
  const dataToday = `${date.getFullYear()}.${dateMonth}.${date.getDate()}`;


  //генерируем и возвращаем в массиве нужное количество дней в формате year/month/day
  const dateGeneration = (n) => {
    const arr = []
    for (let i = 0; i < n; i++) {
      //Отсекаем выходные и добавлен + 1 день
      let getDay = new Date(new Date() - [i] * 24 * 60 * 60 * 1000).getDay();
      if (getDay === 0 || getDay === 1) {
        n = n + 1;
      } else {
        arr.push(new Date(new Date() - [i] * 24 * 60 * 60 * 1000))
      }
    }
    let resultDate = []

    resultDate = arr.map(el => {
      const year = el.getFullYear();
      const month = el.getMonth() + 1 < 10 ? `0${el.getMonth() + 1}` : el.getMonth()
      const day = el.getDate();
      return `${year}/${month}/${day}`

    });
    resultDate.shift()
    return resultDate;
  }


  const arrsTenDay = [];
  useEffect(() => {
    const daysAgo = dateGeneration(10);

    const urls = []
    // в urls push-ым нужные нам запросы с датами 
    for (let i = 0; i < daysAgo.length; i++) {

      urls.push(`https://www.cbr-xml-daily.ru/archive/${daysAgo[i]}/daily_json.js`)

    }

    async function fetchData() {
      for (let i = 0; i < urls.length; i++) {
        try {
          const day = await axios.get(urls[i])
          arrsTenDay.push(day.data.Valute)
        } catch (e) {
          console.log('Выходной!');
        }
      }


      const arrItems = [];
      arrsTenDay.forEach((el, index) => {
        for (const key in el) {
          el[key].date = daysAgo[index]
          arrItems.push(el[key]);
        }

        setItemsTenDays(arrItems)
      })
    }
    fetchData();

  }, []);






  const percent = (value, previous) => {
    let result = (value / previous) * 100 - 100;
    result = Math.floor(result * 100) / 100
    return result;
  }


  return (
    <div className="main">
      <h1 className="title">Курсы валют ЦБ РФ на {dataToday}</h1>
      <div className="container">
        <div className="sort">
        </div>
        <div className="app">
          {
            items.map(item => (
              <Appitem
                key={item.ID}
                percent={percent}
                {...item}
                itemsTenDays={itemsTenDays}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
