import React, { useState } from 'react';

function CardUI() {
    var card = '';
    var search = '';

    const [message, setMessage] = useState('');
    const [searchResults, setResults] = useState('');
    const [cardList, setCardList] = useState('');

    const app_name = 'g26-big-project'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const addCard = async event => {
        event.preventDefault();

        alert('addCard() ' + card.value);

    };

    const searchCard = async event => {
        event.preventDefault();

        alert('searchCard() ' + search.value);
    };

    return (
        <div id="cardUIDiv">
            <br />
            <input type="text" id="searchText" placeholder="Card To Search For"
                ref={(c) => search = c} />
            <button type="button" id="searchCardButton" class="buttons"
                onClick={searchCard}> Search Card</button><br />
            <span id="cardSearchResult">{searchResults}</span>
            <p id="cardList">{cardList}</p><br /><br />
            <input type="text" id="cardText" placeholder="Card To Add"
                ref={(c) => card = c} />
            <button type="button" id="addCardButton" class="buttons"
                onClick={addCard}> Add Card </button><br />
            <span id="cardAddResult">{message}</span>
        </div>

    );
}

export default CardUI;