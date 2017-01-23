# Docker constraint research project

## Description 

### Docker host

  We have a docker host machine with two containers:
  
  1. Priority - [MySQL database server](https://hub.docker.com/_/mysql/)
     We test loading of MySQL database. We imported the [following dataset](https://dev.mysql.com/doc/employee/en/). The main metric that is response time the following SQL query:
     ```sql
      SELECT
        AVG(salary) AS 'avg_salary'
      FROM titles t1
        JOIN salaries t2 ON t1.emp_no = t2.emp_no
      WHERE LOCATE('Engineer', title) > 0
     ```
     
  2. [Normal](https://hub.docker.com/r/dkuffner/docker-stress/) - Linux with [stress utility](https://linux.die.net/man/1/stress) that can impose load on and stress test systems

### Testing tool

   [Apache JMeter](http://jmeter.apache.org/). Jmeter uses to send SQL query to our priority container and collect 
    information about query response time and then send it to our ATSD instance.
    
### Information about docker host
  
  [Axibase collecor](https://github.com/axibase/axibase-collector-docs#axibase-collector) help us to collect information about docker host(such as cpu usage by container, host properties and others) by [remote connection](https://github.com/axibase/axibase-collector-docs/blob/master/jobs/docker.md#remote-collection).
    
### Statistic storage
  Information about response time and docker host stored in instance of [Axibase Time Series Database](https://github.com/axibase/atsd-docs/blob/master/tutorials/getting-started.md)
    
All components are displayed on the following diagram:

![](docs/img/scheme.png)

### Method of research

For researching constraint we will reproduce the following steps:

  1. Enable loading of MySQL server by Apache Jmeter
  2. Create set of stressed configuration
     We will run stressed container with different configuration and observe how it affects on mysql response time.
  3. Then we repeat second step but all stressed configuration  will run with tested constraint.
  4. Compare values of response time and characteristic that controlled by constraint.

## Cpu constraints

### --cpuset-cpus


#### Response time

`*Constraint* : --cpu-set=[0,3]`


###### Overall table without constraint mode

| Statistic type | --cpu 0   | --cpu 1 | --cpu 2   | --cpu 3  | --cpu 4   | --cpu 5  | --cpu 6   | --cpu 7 | --cpu 8 |
|----------------|-----------|---------|-----------|----------|-----------|----------|-----------|---------|---------|
| min            | 1831      | 1602    | 1464      | 1647     | 2073      | 1516     | 1527      | 1495    | 1601    |
| max            | 2209      | 1912    | 1900      | 2743     | 2237      | 2625     | 2607      | 2784    | 2753    |
| avg            | 2140.3125 | 1756.25 | 1676.6875 | 2026.125 | 2179.3125 | 1994.125 | 2046.3125 | 2047.25 | 2062    |
| pct90          | 2206.2    | 1907.8  | 1883.9    | 2714.3   | 2236.3    | 2613.8   | 2604.9    | 2713.3  | 2733.4  |
| pct95          | 2209      | 1912    | 1900      | 2743     | 2237      | 2625     | 2607      | 2784    | 2753    |
| pct99          | 2209      | 1912    | 1900      | 2743     | 2237      | 2625     | 2607      | 2784    | 2753    |



##### Overall table in constraint mode

| Statistic type | --cpu 0 | --cpu 1   | --cpu 2   | --cpu 3   | --cpu 4   | --cpu 5 | --cpu 6   | --cpu 7   | --cpu 8  |
|----------------|---------|-----------|-----------|-----------|-----------|---------|-----------|-----------|----------|
| min            | 1481    | 1486      | 1664      | 1540      | 2001      | 1730    | 1519      | 1572      | 1541     |
| max            | 2506    | 1527      | 2751      | 2792      | 2394      | 2881    | 2227      | 2957      | 2839     |
| avg            | 1855.5  | 1510.1875 | 2055.2856 | 2069.7144 | 2220.5715 | 2202.4  | 2011.3572 | 2184.9333 | 2072.077 |
| pct90          | 2339.4  | 1525.6    | 2657      | 2791      | 2359.5    | 2874.4  | 2224      | 2831      | 2809.8   |
| pct95          | 2506    | 1527      | 2751      | 2792      | 2394      | 2881    | 2227      | 2957      | 2839     |
| pct99          | 2506    | 1527      | 2751      | 2792      | 2394      | 2881    | 2227      | 2957      | 2839     |



## CPU Usage by MySQL daemon


### Without constraint mode

| Process | --cpu 0 | --cpu 1 | --cpu 2 | --cpu 3 | --cpu 4 | --cpu 5 | --cpu 6 | --cpu 7 | --cpu 8 |
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
| mysql   | 169     | 155.8   | 171.467 | 197.8   | 171.6   | 183.267 | 181.933 | 181.533 | 193.867 |


### Constraint mode

| Process | --cpu 0 | --cpu 1 | --cpu 2 | --cpu 3 | --cpu 4 | --cpu 5 | --cpu 6 | --cpu 7 | --cpu 8 |
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
| mysql   | 146.733 | 181.533 | 184.8   | 219.6   | 210.8   | 218.133 | 221.2   | 208.4   | 208.533 |
