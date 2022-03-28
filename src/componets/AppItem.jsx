import React, { useState } from 'react';

const Appitem = ({ CharCode, Name, Value, Previous, percent, itemsTenDays }) => {

    const [showTenBloks, setshowTenBloks] = useState(false);
    const [charCode, setCharCode] = useState('');

    const classezz = (value, previousValue) => {
        if (percent(value, previousValue) > 0) {
            return 'app__item-percent--color green';
        } else if (percent(value, previousValue) < 0) {
            return 'app__item-percent--color red'
        }
        return 'app__item-percent--color';
    }

    const showUpOrDownSymbol = (value, previousValue) => {
        if (percent(value, previousValue) > 0) {
            return <span>&uarr;</span>
        } else if (percent(value, previousValue) < 0) {
            return <span>&darr;</span>
        }
        return ''
    }

    const showInTenDay = (CharCode) => {
        setshowTenBloks(!showTenBloks)
        setCharCode(CharCode);
    }


    const itemDays = itemsTenDays.filter(item => {
        return item.CharCode === charCode

    })




    return (
        <div className="app__item-wrapper">
            <div className="app__item" onClick={() => { showInTenDay(CharCode) }}>
                <div className="app__item-code">
                    КОД: <span>{CharCode}</span>
                    <div className="app__item-code--name">{Name}</div>
                </div>
                <div className="app__item-currency">
                    Курс: <span>{Value}</span>
                </div>
                <div className="app__item-percent">
                    <b className={classezz(Value, Previous)}>
                        {showUpOrDownSymbol(Value, Previous)}
                        {percent(Value, Previous)}%
                    </b>
                </div>
            </div>
            {showTenBloks &&
                itemDays.map((el, index) => (

                    <div key={el.ID + + index} className="app__item--plusTenBlock">
                        <div className="app__item-min">
                            <p>{el.date}</p>
                            <div className="app__item-code">
                                КОД: <span>{el.CharCode}</span>
                                <div className="app__item-code--name">{el.Name}</div>
                            </div>
                            <div className="app__item-currency">
                                Курс: <span>{el.Value}</span>
                            </div>
                            <div className="app__item-percent">
                                <b className={classezz(el.Value, el.Previous)}>
                                    {showUpOrDownSymbol(el.Value, el.Previous)}
                                    {percent(el.Value, el.Previous)}%
                                </b>
                            </div>
                        </div>
                    </div>
                ))



            }
        </div>

    );
}

export default Appitem;
