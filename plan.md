## phases
- [x] create a client table for the events
- [ ] create a backend that can write the events
- [ ] Make a view (Pure SQL or asyncrones materialized)
- [ ] python spreadsheet service
- [ ] public front-end and client read service
## create a client table for the events
Client id, event number -> PK
offset (autoincrement)
Cliente age
Client name
Event type (Create, Update, Delete)
User to Blame
timestamp
## Create a client write service
This backend will have endpoints to create, update and delete users

the single purpose of the backend is to write the events to the client table

The front-end and any other service who needs modify the client table will call this service

This service is also responsible for the consistency of the client event table (not allowing updates for a deleted reccord for example)
## Make a view (asyncrones materialized views)
A python service that

query for the offset on the metadata table

Poll for events above the last offset

Loop through the events, bulding a list of commands to execute

example:
{
    user_1: {
        command: Create,
        age: 22,
        name: sciel
    }
}

and them for each new entry we can check for a user on this dict and update it acordinly

After we processed every event I can generate a list of queries and execute them as a transaction

One important query needs to be added to the list before executing. a metadata update query. That will update the metadata table with the current information
## python spreadsheet service
The spread_sheet service is responsible for polling the metadata table and updating the needed spreadsheet according to the view


The spreadsheet service will probably use pandas and gspread_pandas.
The method df_to_sheet seems particularly usefull

Maybe the gspread pandas will not be flexible enough to build a decent sheet. In this case I will use the original gspread lib to write the data
## Client read service and front end
The frontend is where users will be able to see the clients and update them
It will connect to the client write service with http
And to the client read service with websockets

The client read service is responsable for polling the view and and serving them to a front-end on change. It will use websockets to update the frontend in real time.
