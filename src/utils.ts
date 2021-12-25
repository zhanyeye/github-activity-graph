import { Request, Response } from 'express';
import { Card } from './GraphCards';
import { invalidUserSvg } from './svgs';
import { fetchContributions } from './fetcher';
import { queryOption, userDetails } from '../interfaces/interface';
import { fetcher, gqlQuery } from '../types/types';


const setHttpHeader = (res: Response, directivesAndAge: string): void => {
  res.setHeader('Cache-Control', `${directivesAndAge}`);
  res.set('Content-Type', 'image/svg+xml');
};

const options: queryOption = {
  username: 'zhanyeye',
  hide_title: false,
  colors: {
    areaColor: '9e4c98',
    bgColor: 'fffff0',
    borderColor: '0000',
    color: '708090',
    lineColor: '9e4c98',
    pointColor: '24292e',
  },
  area: true,
};

//HOF
export const getGraph =
  (graphqlQuery: gqlQuery, fetch: fetcher) =>
  async (req: Request, res: Response) => {
    console.log(req.statusCode);
    try {
      const fetchCalendarData: userDetails | string = await fetchContributions(
        `${options.username}`,
        graphqlQuery,
        fetch
      );

      if (typeof fetchCalendarData === 'object') {
        let title = '';

        if (!options.hide_title) {
          if (options.custom_title) {
            title = options.custom_title;
          } else {
            title = `${
              fetchCalendarData.name !== null
                ? fetchCalendarData.name
                : options.username
            }'s Contribution Graph`;
          }
        }

        const graph: Card = new Card(
          280,
          1200,
          options.colors,
          title,
          options.area
        );

        const getChart: string = await graph.chart(
          fetchCalendarData.contributions
        );

        setHttpHeader(res, 'public, max-age=1800');
        res.status(200).send(getChart);
      } else {
        setHttpHeader(res, 'no-store, max-age=0');
        res.send(invalidUserSvg(fetchCalendarData));
      }
    } catch (error) {
      setHttpHeader(res, 'no-store, max-age=0');
      res.send(invalidUserSvg('Something unexpected happened 💥'));
    }
  };

/* DO NOT CHANGE THE CODE BELOW */
export const getData =
  (graphqlQuery: gqlQuery, fetch: fetcher) =>
  async (req: Request, res: Response) => {
    console.log(req.statusCode);
    try {
      const fetchCalendarData: userDetails | string = await fetchContributions(
        `${options.username}`,
        graphqlQuery,
        fetch
      );

      if (typeof fetchCalendarData === 'object') {
        res.status(200).send(fetchCalendarData);
      } else {
        res.send(invalidUserSvg(fetchCalendarData));
      }
    } catch (error) {
      res.send(invalidUserSvg('Something unexpected happened 💥'));
    }
  };
