const movieApiKey = 'e368853e'; // แทนที่ด้วย API key ของ OMDb

document.getElementById('checkButton').addEventListener('click', () => {
    const weatherCondition = document.getElementById('weatherInput').value.toLowerCase(); // รับข้อมูลสภาพอากาศจากผู้ใช้
    const movieInfo = document.getElementById('movieInfo');

    // ล้างข้อมูลก่อนแสดงผลใหม่
    movieInfo.innerHTML = '';

    // แสดงข้อความของผู้ใช้ในข้อมูลหนัง
    movieInfo.innerHTML = `<p><strong>คุณ:</strong> ${weatherCondition}</p>`;

    let keyword;
    let weatherConditionLower = weatherCondition.toLowerCase().trim();

    // กำหนดคำค้นหาตามสภาพอากาศที่กรอก
    if (/clear|sunny|bright/.test(weatherConditionLower)) {
        keyword = "adventure";
    } else if (/rain|drizzle/.test(weatherConditionLower)) {
        keyword = "romance";
    } else if (/snow|blizzard/.test(weatherConditionLower)) {
        keyword = "holiday";
    } else if (/cloudy|overcast/.test(weatherConditionLower)) {
        keyword = "drama";
    } else if (/storm|thunderstorm/.test(weatherConditionLower)) {
        keyword = "thriller";
    } else if (/fog|mist/.test(weatherConditionLower)) {
        keyword = "mystery";
    } else if (/wind|breezy/.test(weatherConditionLower)) {
        keyword = "comedy";
    } else if (/hot|heatwave/.test(weatherConditionLower)) {
        keyword = "action";
    } else if (/cold|Thick fog/.test(weatherConditionLower)) {
        keyword = "horror";
    } else {
        keyword = "drama"; // ใช้เป็นคำค้นหาพื้นฐานถ้าสภาพอากาศไม่ตรง
    }

    // ค้นหาภาพยนตร์ตามคำค้นหา
    fetch(`https://www.omdbapi.com/?s=${keyword}&apikey=${movieApiKey}`)
        .then(movieResponse => {
            if (!movieResponse.ok) {
                throw new Error('ไม่พบข้อมูลภาพยนตร์');
            }
            return movieResponse.json();
        })
        .then(movieData => {
            if (movieData.Response === "False") {
                throw new Error(movieData.Error);
            }

            if (movieData.Search.length === 0) {
                movieInfo.innerHTML += `<p><strong>บอท:</strong> ไม่พบภาพยนตร์ที่แนะนำสำหรับสภาพอากาศ "${weatherCondition}"</p>`;
            } else {
                const movies = movieData.Search.map(movie => `
                    <div>
                        <img src="${movie.Poster}" alt="${movie.Title} poster">
                        <h3>${movie.Title} (${movie.Year})</h3>
                        <p>ประเภท: ${movie.Type}</p>
                    </div>
                `).join('');
                movieInfo.innerHTML += `<p><strong>บอท:</strong> ภาพยนตร์ที่แนะนำสำหรับสภาพอากาศ "${weatherCondition}": </p>${movies}`;
            }
        })
        .catch(error => {
            movieInfo.innerHTML += `<p><strong>บอท:</strong> ${error.message}</p>`;
        });
});
