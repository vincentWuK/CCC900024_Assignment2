# Backend - Twitter Crawler

### Files:

- TweetsCrawler.py: Used to stream tweets that match the rules and store them in couchdb.
- conf.json: Used to store configuration files.
- keywords_job.txt: Used to store keywords related to unemployment.
- keywords_multiculture.txt: Used to store keywords related to multiculturalism.
- main.py: The main program, used to create multi-processes and multi-threads.
- setenv.sh: bash script file, used to install the environment.
- requirements.txt: List of third-party python libraries to be used.
- FindBBox.py: Used to find city's or suburb's bounding box.

### Task List:

- [x] Streaming get tweets - done with Twarc.

- [x] Cleaning of eligible tweets - done with jionlp python library.
  - [x] Remove HTML tags, remove abnormal characters, remove redundant characters, remove bracketed supplements, remove URLs, remove E-mails, remove phone numbers, replace full alphanumeric spaces with half-alphanumeric spaces.

- [x] Find keywords related to the topic and store them in keywords_topic.txt.

  - Topic 1: multi-culture
    - [x] words related to the multi-culture.
  
  - Topic 2: job
    - [x] words related to the job.
  
- [x] Write sh files to install the environment.

- [x] Write main program to start multiple TweetsCrawler with multiple processes and threads.

- [x] Write a program to analysis historical data.

- [x] Write programs to search 30 days and full-archive data

- [x] Improve the accuracy of suburb finder.

- [ ] Complete a machine learning model to classify tweets' texts.

### Running Instructions

1. Run setenv.sh in the terminal, you probably need to enter the admin password for sudo

   ```bash
   ./setenv.sh
   ```

2. Run main.py in the terminal to start crawlers

   - -c: configuration file's path 
   - -t: topic 1, analysis within suburbs
   - -p: topic 2, analysis within cities
   
   ```bash
   mpirun -n 2 python3 main.py -c "conf.json" -t "multiculture" -p "job"
   ```

