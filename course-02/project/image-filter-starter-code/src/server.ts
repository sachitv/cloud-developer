import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response) => {
    let { image_url } = req.query;
    if (!image_url) {
      res.status(400).send("Missing parameter image_url");
      return;
    }
    try {
      const parsed_url = new URL(image_url as string);
      const result: string = await filterImageFromURL(parsed_url.toString());
      res.status(200).sendFile(result, async (err) => {
        await deleteLocalFiles([result]);
      });
    } catch (TypeError) {
      res.status(422).send("Parameter image_url was not a valid url");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();