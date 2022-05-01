# Backend - Twitter Crawler

### Files:

- TweetsCrawler.py: Used to stream tweets that match the rules and store them in couchdb.
- conf.json: Used to store configuration files.
- keywords_job.txt: Used to store keywords related to unemployment.
- keywords_multiculture.txt: Used to store keywords related to multiculturalism.
- main.py: The main program, used to create multi-processes and multi-threads.
- setenv.sh: bash script file, used to install the environment.
- requirements.txt: List of third-party python libraries to be used.

### Things Completed:

- [x] Streaming get tweets - done with Twarc.
- [x] Cleaning of eligible tweets - done with jionlp python library.
  - [x] Remove html tags, remove abnormal characters, remove redundant characters, remove bracketed supplements, remove URLs, remove E-mails, remove phone numbers, replace full alphanumeric spaces with half-alphanumeric spaces.

- [x] Find keywords related to the topic and store them in keywords_topic.txt.

  - Topic: unemployment
    - [x] words related to the unemployment
  
- [x] Write sh files to install the environment
- [x] Write main program to start multiple TweetsCrawler with multiple processes and threads

### Running Instructions

1. Run setenv.sh in the terminal, you probably need to enter the admin password for sudo

   ```bash
   ./setenv.sh
   ```

2. Run main.py in the terminal to start crawlers

   - -c: configuration file's path 

   ```bash
   mpirun -n 2 python3 main.py -c "conf.json"
   ```

