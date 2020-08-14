# Author: Abhijit Baldawa
## tv-series
A Node.js/Typescript REST server which returns the top 20 popular episodes of any series from TMDB API's

## Notes on tools and techniques used
1. Node.js 14 is used
2. I have used in-memory array as a database to save most visited series for analytics. It can easily replaced with any ORM client and its associated database as the code is highly modular
3. After getting the response from TMDB API I am not caching those responses in local server because if ratings of episodes change in TMDB server then the API '/topEpisodes/:seriesId' will not show correct updated results. But caching can be easily implemented as and when we get any response from TMDB API so that the response to subsequent requests for the same seriesId can be pulled from cache instead of again going back to TMDB Server. In this case we need to decide how long we want to store information in cache (or database) before clearing those cache (or DB records) and risk showing stale responses for that time in-case the ratings change. To keep single point of truth and not show stale results this server does not cache results but as the code is modular it can be implamanted easily if we can decide how long to keep those results in cache before clearing them.  

## How to run using docker container (Prerequisite -> docker must be installed and need to have TMDB developers API key as mentioned on https://developers.themoviedb.org/3/getting-started/introduction)
Got to terminal and execute below commands:
1. git clone https://github.com/abaldawa/tv-series.git
2. cd tv-series/server
3. cp .env.example .env   (i.e. create .env file from .env.example )
4. vi .env   (in .env file for key "TMDB_API_KEY" set the key value to TMDB API key i.e. TMDB_API_KEY=<paste_your_key_here> and save file)
6. cd ..   (i.e. got to root of 'tv-series' repo)
3. docker build -t tv-series . && docker run -p 3000:3000 -it tv-series
4. Go to browser and got to below URL's
    1. http://localhost:3000/topEpisodes/1399 -> see the top 20 episodes of series Id '1399' (NOTE: replace 1399 with any seriesId you want to see top 20 episodes of)
    2. http://localhost:3000/analytics/popularSeries -> see the top 5 most visites series on this server
    
## The core business logic is unit tested and can be run locally as below
1. git clone https://github.com/abaldawa/tv-series.git
2. cd tv-series/server
3. npm i
4. npm test
