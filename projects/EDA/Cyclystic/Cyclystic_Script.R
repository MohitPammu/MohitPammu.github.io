library(tidyverse)
library(conflicted)
library(readxl)

conflict_prefer("filter", "dplyr")
conflict_prefer("lag", "dplyr")

y2023_01 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.01-divvy-tripdata.xlsx")
y2023_02 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.02-divvy-tripdata.xlsx")
y2023_03 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.03-divvy-tripdata.xlsx")
y2023_04 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.04-divvy-tripdata.xlsx")
y2023_05 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.05-divvy-tripdata.xlsx")
y2023_06 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.06-divvy-tripdata.xlsx")
y2023_07 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.07-divvy-tripdata.xlsx")
y2023_08 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.08-divvy-tripdata.xlsx")
y2023_09 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.09-divvy-tripdata.xlsx")
y2023_10 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.10-divvy-tripdata.xlsx")
y2023_11 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.11-divvy-tripdata.xlsx")
y2023_12 <- read_excel("~/Desktop/DA Certificate/DA_Capstone_Project/Excel/2023.12-divvy-tripdata.xlsx")

y2023_01 <- mutate(y2023_01, end_lat = as.numeric(end_lat))

y2023_02 <- mutate(y2023_02, end_lat = as.numeric(end_lat))

y2023_03 <- mutate(y2023_03, end_lat = as.numeric(end_lat))

y2023_04 <- mutate(y2023_04, end_lat = as.numeric(end_lat))

y2023_05 <- mutate(y2023_05, end_lat = as.numeric(end_lat))

y2023_07 <- mutate(y2023_07, end_lat = as.numeric(end_lat))

y2023_08 <- mutate(y2023_08, end_lat = as.numeric(end_lat))

y2023_09 <- mutate(y2023_09, end_lat = as.numeric(end_lat))

y2023_10 <- mutate(y2023_10, end_lat = as.numeric(end_lat))

y2023_11 <- mutate(y2023_11, end_lat = as.numeric(end_lat))

y2023_12 <- mutate(y2023_12, end_lat = as.numeric(end_lat))

all_trips <- bind_rows(y2023_01,
                       y2023_02,
                       y2023_03,
                       y2023_04,
                       y2023_05,
                       y2023_06,
                       y2023_07,
                       y2023_08,
                       y2023_09,
                       y2023_10,
                       y2023_11,
                       y2023_12)

all_trips <- all_trips %>%
  select(-c(start_lat,start_lng,end_lat,end_lng))

all_trips$date <- as.Date(all_trips$started_at) 
all_trips$month <- format(as.Date(all_trips$date), "%m")
all_trips$day <- format(as.Date(all_trips$date), "%d")
all_trips$year <- format(as.Date(all_trips$date), "%Y")
all_trips$day_of_week <- format(as.Date(all_trips$date), "%A")

all_trips$ride_length <- difftime(all_trips$ended_at,all_trips$started_at)

all_trips$ride_length <- as.numeric(as.character(all_trips$ride_length))

all_trips_no_na <- drop_na(all_trips)

all_trips_v2 <- all_trips_no_na[!(all_trips_no_na$start_station_name == "HQ QR" | all_trips_no_na$ride_length<0),]

aggregate(all_trips_v2$ride_length/60 ~ all_trips_v2$member_casual, FUN = mean)
aggregate(all_trips_v2$ride_length/60 ~ all_trips_v2$member_casual, FUN = median)
aggregate(all_trips_v2$ride_length/60 ~ all_trips_v2$member_casual, FUN = max)
aggregate(all_trips_v2$ride_length/60 ~ all_trips_v2$member_casual, FUN = min)

aggregate(all_trips_v2$day_of_week ~ all_trips_v2$member_casual, FUN = mode)

all_trips_v2$day_of_week <- ordered(all_trips_v2$day_of_week, levels=c("Sunday", 
                                                                       "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"))

aggregate(all_trips_v2$ride_length/60 ~ all_trips_v2$member_casual + all_trips_v2$day_of_week, FUN = mean)

all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>%
  group_by(member_casual, weekday) %>%  
  summarise(number_of_rides = n()	
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, weekday)	

all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>% 
  group_by(member_casual, weekday) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, weekday)  %>% 
  ggplot(aes(x = weekday, y = number_of_rides, fill = member_casual)) +
  geom_col(position = "dodge")

options(scipen = 999)
all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>% 
  group_by(member_casual, weekday) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, weekday)  %>% 
  ggplot(aes(x = weekday, y = number_of_rides, fill = member_casual)) +
  scale_fill_manual(values = c("darkcyan","#F0E442")) +
  geom_col(position = "dodge") + 
  labs(title = "Number of Rides by Day and Rider Type", fill = " ") + 
  ylab("Number of Rides") + 
  xlab("Day of Week") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2)) 

all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>% 
  group_by(member_casual, weekday) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, weekday)  %>% 
  ggplot(aes(x = weekday, y = average_duration, fill = member_casual)) +
  scale_fill_manual(values = c("#008b8b","#F0E442")) +
  geom_col(position = "dodge") + 
  labs(title = "Average Ride Duration by Day and Rider Type", fill = " ") + 
  ylab("Average Duration (minutes)") + 
  xlab("Day of Week") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))


all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>% 
  group_by(rideable_type, weekday) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(rideable_type, weekday)  %>% 
  ggplot(aes(x = weekday, y = average_duration, fill = rideable_type)) +
  scale_fill_manual(values = c("#008b8b", "#F0E442", "#56B4E9")) +
  geom_col(position = "dodge") + 
  labs(title = "Average Ride Duration by Day and Bike Type", fill = " ") + 
  ylab("Average Duration (minutes)") + 
  xlab("Day of Week") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))

all_trips_v2 %>% 
  group_by(member_casual, month) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, month)  %>% 
  ggplot(aes(x = month, y = number_of_rides, fill = member_casual)) +
  scale_fill_manual(values = c("darkcyan", "#F0E442")) +
  geom_col(position = "dodge") + 
  labs(title = "Number of Rides by Month and Rider Type", fill = " ") + 
  ylab("Number of Rides") + 
  xlab("Month") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2)) 

all_trips_v2 %>% 
  group_by(member_casual, month) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(member_casual, month)  %>% 
  ggplot(aes(x = month, y = average_duration, fill = member_casual)) +
  scale_fill_manual(values = c("darkcyan", "#F0E442")) +
  geom_col(position = "dodge") + 
  labs(title = "Average Ride Duration by Month and Rider Type", fill = " ") + 
  ylab("Average Duration (minutes)") + 
  xlab("Month") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))

all_trips_v2 %>% 
  group_by(rideable_type, month) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(rideable_type, month)  %>% 
  ggplot(aes(x = month, y = average_duration, fill = rideable_type)) +
  scale_fill_manual(values = c("darkcyan", "#F0E442", "#56B4E9")) +
  geom_col(position = "dodge") + 
  labs(title = "Average Ride Duration by Month and Bike Type", fill = " ") + 
  ylab("Average Duration (minutes)") + 
  xlab("Month") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))

all_trips_v2 %>% 
  group_by(rideable_type, member_casual) %>% 
  summarise(number_of_rides = n()) %>% 
  arrange(rideable_type, member_casual)  %>% 
  ggplot(aes(x = member_casual, y = number_of_rides, fill = rideable_type)) +
  geom_col(position = "dodge") + 
  labs(title = "Number of Rides by Rider Type and Bike Type") + 
  ylab("Number of Rides") + 
  xlab("Rider Type") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))

options(scipen = 999)
all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE)) %>% 
  group_by(rideable_type, weekday) %>% 
  summarise(number_of_rides = n()
            ,average_duration = mean(ride_length/60)) %>% 
  arrange(rideable_type, weekday)  %>% 
  ggplot(aes(x = weekday, y = number_of_rides, fill = rideable_type)) +
  scale_fill_manual(values = c("darkcyan","#F0E442", "#56B4E9")) +
  geom_col(position = "dodge") + 
  labs(title = "Number of Rides by Day and Bike Type", fill = " ") + 
  ylab("Number of Rides") + 
  xlab("Day of Week") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2)) 

all_trips_v2 %>% 
  group_by(rideable_type, member_casual) %>% 
  summarise(number_of_rides = n()) %>% 
  arrange(rideable_type, member_casual)  %>% 
  ggplot(aes(x = member_casual, y = number_of_rides, fill = rideable_type)) +
  geom_col(position = "dodge") + 
  scale_fill_manual(values = c("#008b8b", "#F0E442", "#56B4E9")) + 
  labs(title = "Number of Rides by Rider Type and Bike Type") + 
  ylab("Number of Rides") + 
  xlab("Rider Type") +
  theme(plot.title = element_text(hjust = 0.5)) +
  theme(axis.title.y = element_text(vjust = 2))