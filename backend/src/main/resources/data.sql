-- Sample data for Roamy Travel Booking Application
-- This script will be automatically executed when the application starts

-- Insert sample destinations
INSERT INTO destinations (id, name, city, country, country_code, latitude, longitude, description, time_zone, climate, best_time_to_visit, budget_daily_cost, mid_range_daily_cost, luxury_daily_cost, average_rating, total_reviews, popularity_score, active) VALUES
(1, 'Paris', 'Paris', 'France', 'FR', 48.8566, 2.3522, 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.', 'Europe/Paris', 'Temperate oceanic', 'April to October', 60.00, 120.00, 300.00, 4.5, 15420, 95, true),
(2, 'Tokyo', 'Tokyo', 'Japan', 'JP', 35.6762, 139.6503, 'A bustling metropolis blending traditional culture with cutting-edge technology.', 'Asia/Tokyo', 'Humid subtropical', 'March to May, September to November', 80.00, 150.00, 400.00, 4.6, 12350, 92, true),
(3, 'New York', 'New York', 'United States', 'US', 40.7128, -74.0060, 'The Big Apple, famous for Times Square, Central Park, and Broadway shows.', 'America/New_York', 'Humid continental', 'April to June, September to November', 100.00, 200.00, 500.00, 4.3, 18750, 98, true),
(4, 'London', 'London', 'United Kingdom', 'GB', 51.5074, -0.1278, 'Historic capital with iconic landmarks like Big Ben, Tower Bridge, and Buckingham Palace.', 'Europe/London', 'Temperate oceanic', 'May to September', 70.00, 140.00, 350.00, 4.4, 14200, 90, true),
(5, 'Barcelona', 'Barcelona', 'Spain', 'ES', 41.3851, 2.1734, 'Vibrant Mediterranean city known for Gaudí architecture and beautiful beaches.', 'Europe/Madrid', 'Mediterranean', 'April to October', 45.00, 90.00, 250.00, 4.5, 11800, 87, true),
(6, 'Rome', 'Rome', 'Italy', 'IT', 41.9028, 12.4964, 'The Eternal City, home to the Colosseum, Vatican, and incredible history.', 'Europe/Rome', 'Mediterranean', 'April to October', 50.00, 100.00, 280.00, 4.4, 13600, 89, true),
(7, 'Sydney', 'Sydney', 'Australia', 'AU', -33.8688, 151.2093, 'Harbor city famous for Opera House, Harbor Bridge, and beautiful beaches.', 'Australia/Sydney', 'Humid subtropical', 'September to November, March to May', 90.00, 170.00, 420.00, 4.5, 9800, 85, true),
(8, 'Istanbul', 'Istanbul', 'Turkey', 'TR', 41.0082, 28.9784, 'Transcontinental city bridging Europe and Asia, rich in history and culture.', 'Europe/Istanbul', 'Mediterranean', 'April to October', 35.00, 70.00, 200.00, 4.3, 8900, 82, true),

-- Popular destinations from India
(9, 'Bangkok', 'Bangkok', 'Thailand', 'TH', 13.7563, 100.5018, 'Vibrant capital known for temples, street food, bustling markets and nightlife.', 'Asia/Bangkok', 'Tropical', 'November to March', 25.00, 50.00, 150.00, 4.4, 22100, 94, true),
(10, 'Singapore', 'Singapore', 'Singapore', 'SG', 1.3521, 103.8198, 'Modern city-state famous for Gardens by the Bay, Marina Bay Sands, and diverse cuisine.', 'Asia/Singapore', 'Tropical rainforest', 'February to April', 70.00, 140.00, 350.00, 4.6, 18900, 91, true),
(11, 'Dubai', 'Dubai', 'United Arab Emirates', 'AE', 25.2048, 55.2708, 'Futuristic city with luxury shopping, ultramodern architecture, and desert adventures.', 'Asia/Dubai', 'Desert', 'November to March', 80.00, 160.00, 400.00, 4.5, 16750, 93, true),
(12, 'Kuala Lumpur', 'Kuala Lumpur', 'Malaysia', 'MY', 3.1390, 101.6869, 'Multicultural capital famous for Petronas Towers, street food, and shopping.', 'Asia/Kuala_Lumpur', 'Tropical rainforest', 'May to July, December to February', 20.00, 40.00, 120.00, 4.3, 14500, 88, true),
(13, 'Colombo', 'Colombo', 'Sri Lanka', 'LK', 6.9271, 79.8612, 'Coastal capital with colonial architecture, beaches, and vibrant culture.', 'Asia/Colombo', 'Tropical', 'December to March, July to August', 15.00, 30.00, 90.00, 4.2, 8900, 86, true),
(14, 'Kathmandu', 'Kathmandu', 'Nepal', 'NP', 27.7172, 85.3240, 'Mountain capital rich in Hindu and Buddhist heritage, gateway to the Himalayas.', 'Asia/Kathmandu', 'Subtropical highland', 'October to December, March to May', 12.00, 25.00, 75.00, 4.1, 6700, 79, true),
(15, 'Ho Chi Minh City', 'Ho Chi Minh City', 'Vietnam', 'VN', 10.8231, 106.6297, 'Bustling metropolis known for French colonial landmarks and vibrant street life.', 'Asia/Ho_Chi_Minh', 'Tropical', 'December to April', 18.00, 35.00, 100.00, 4.2, 11200, 83, true),
(16, 'Bali', 'Denpasar', 'Indonesia', 'ID', -8.6500, 115.2167, 'Tropical paradise known for beaches, temples, rice terraces, and wellness retreats.', 'Asia/Makassar', 'Tropical', 'April to October', 22.00, 45.00, 130.00, 4.5, 19800, 90, true),
(17, 'Maldives', 'Malé', 'Maldives', 'MV', 4.1755, 73.5093, 'Tropical paradise with overwater bungalows, crystal-clear waters, and pristine beaches.', 'Indian/Maldives', 'Tropical', 'November to April', 150.00, 300.00, 800.00, 4.7, 12400, 88, true),
(18, 'Seoul', 'Seoul', 'South Korea', 'KR', 37.5665, 126.9780, 'Dynamic capital blending ancient palaces with modern technology and K-pop culture.', 'Asia/Seoul', 'Continental', 'April to June, September to November', 45.00, 90.00, 220.00, 4.4, 15600, 85, true),
(19, 'Bhutan', 'Thimphu', 'Bhutan', 'BT', 27.4728, 89.6390, 'Himalayan kingdom famous for Gross National Happiness and pristine landscapes.', 'Asia/Thimphu', 'Alpine', 'March to May, September to November', 250.00, 300.00, 500.00, 4.6, 3200, 75, true),
(20, 'Doha', 'Doha', 'Qatar', 'QA', 25.2854, 51.5310, 'Modern Arabian city known for futuristic skyline, museums, and luxury experiences.', 'Asia/Qatar', 'Desert', 'November to April', 60.00, 120.00, 300.00, 4.3, 8900, 81, true),

-- Indian Destinations
(21, 'Mumbai', 'Mumbai', 'India', 'IN', 19.0760, 72.8777, 'Financial capital of India, home to Bollywood, Gateway of India, and vibrant street life.', 'Asia/Kolkata', 'Tropical', 'November to February', 600.00, 1200.00, 3000.00, 4.4, 34500, 95, true),
(22, 'Delhi', 'New Delhi', 'India', 'IN', 28.6139, 77.2090, 'Capital city with Red Fort, India Gate, and rich Mughal history.', 'Asia/Kolkata', 'Continental', 'October to March', 500.00, 1000.00, 2500.00, 4.3, 29800, 92, true),
(23, 'Goa', 'Panaji', 'India', 'IN', 15.2993, 74.1240, 'Beach paradise with Portuguese heritage, nightlife, and water sports.', 'Asia/Kolkata', 'Tropical', 'November to March', 800.00, 1500.00, 3500.00, 4.6, 28900, 89, true),
(24, 'Kerala', 'Kochi', 'India', 'IN', 9.9312, 76.2673, 'Gods Own Country with backwaters, hill stations, and Ayurvedic treatments.', 'Asia/Kolkata', 'Tropical', 'October to March', 700.00, 1300.00, 3200.00, 4.5, 25600, 87, true),
(25, 'Rajasthan', 'Jaipur', 'India', 'IN', 26.9124, 75.7873, 'Land of Kings with palaces, forts, desert safaris, and royal heritage.', 'Asia/Kolkata', 'Desert', 'October to March', 600.00, 1200.00, 3000.00, 4.4, 31200, 91, true),
(26, 'Kashmir', 'Srinagar', 'India', 'IN', 34.0837, 74.7973, 'Paradise on Earth with Dal Lake, houseboats, and snow-capped mountains.', 'Asia/Kolkata', 'Continental', 'April to October', 800.00, 1500.00, 3500.00, 4.7, 18900, 86, true),
(27, 'Ladakh', 'Leh', 'India', 'IN', 34.1526, 77.5770, 'High altitude desert with monasteries, adventure sports, and stunning landscapes.', 'Asia/Kolkata', 'Cold desert', 'May to September', 900.00, 1800.00, 4000.00, 4.6, 15400, 84, true),
(28, 'Himachal Pradesh', 'Shimla', 'India', 'IN', 31.1048, 77.1734, 'Hill station with colonial architecture, apple orchards, and mountain adventures.', 'Asia/Kolkata', 'Highland', 'March to October', 700.00, 1400.00, 3200.00, 4.5, 21300, 85, true),
(29, 'Tamil Nadu', 'Chennai', 'India', 'IN', 13.0827, 80.2707, 'Cultural hub with ancient temples, classical dance, and South Indian cuisine.', 'Asia/Kolkata', 'Tropical', 'November to March', 500.00, 1000.00, 2400.00, 4.3, 26700, 88, true),
(30, 'Karnataka', 'Bangalore', 'India', 'IN', 12.9716, 77.5946, 'Garden city and IT capital with pleasant weather and vibrant nightlife.', 'Asia/Kolkata', 'Tropical highland', 'October to February', 600.00, 1200.00, 2800.00, 4.2, 23400, 83, true),
(31, 'Uttarakhand', 'Dehradun', 'India', 'IN', 30.3165, 78.0322, 'Adventure capital with Rishikesh yoga, Haridwar spirituality, and Himalayan treks.', 'Asia/Kolkata', 'Highland', 'March to June, September to November', 650.00, 1300.00, 3000.00, 4.4, 19800, 82, true),
(32, 'Andhra Pradesh', 'Hyderabad', 'India', 'IN', 17.3850, 78.4867, 'City of Nizams with Charminar, biryani, and IT hub attractions.', 'Asia/Kolkata', 'Semi-arid', 'October to March', 450.00, 900.00, 2200.00, 4.1, 18600, 79, true),
(33, 'West Bengal', 'Kolkata', 'India', 'IN', 22.5726, 88.3639, 'Cultural capital with Howrah Bridge, Victoria Memorial, and Bengali heritage.', 'Asia/Kolkata', 'Tropical', 'October to March', 400.00, 800.00, 2000.00, 4.2, 22100, 80, true),
(34, 'Gujarat', 'Ahmedabad', 'India', 'IN', 23.0225, 72.5714, 'Land of legends with Rann of Kutch, Gir Lions, and vibrant festivals.', 'Asia/Kolkata', 'Semi-arid', 'November to February', 500.00, 1000.00, 2500.00, 4.3, 17900, 81, true),

-- Neighboring Countries and Extended Regions
(35, 'Islamabad', 'Islamabad', 'Pakistan', 'PK', 33.6844, 73.0479, 'Modern capital city with Faisal Mosque and scenic Margalla Hills.', 'Asia/Karachi', 'Continental', 'March to May, October to November', 300.00, 600.00, 1500.00, 4.1, 8900, 75, true),
(36, 'Lahore', 'Lahore', 'Pakistan', 'PK', 31.5497, 74.3436, 'Cultural heart of Pakistan with Badshahi Mosque and rich Mughal heritage.', 'Asia/Karachi', 'Continental', 'November to March', 250.00, 500.00, 1200.00, 4.2, 12400, 78, true),
(37, 'Karachi', 'Karachi', 'Pakistan', 'PK', 24.8607, 67.0011, 'Port city and commercial hub with beaches and vibrant markets.', 'Asia/Karachi', 'Desert', 'December to February', 200.00, 400.00, 1000.00, 3.9, 15600, 73, true),
(38, 'Kandy', 'Kandy', 'Sri Lanka', 'LK', 7.2906, 80.6337, 'Cultural capital with Temple of the Tooth and scenic hill country.', 'Asia/Colombo', 'Tropical highland', 'December to March, July to August', 400.00, 800.00, 2000.00, 4.4, 14200, 84, true),
(39, 'Galle', 'Galle', 'Sri Lanka', 'LK', 6.0535, 80.2210, 'Historic fort city with Dutch architecture and pristine beaches.', 'Asia/Colombo', 'Tropical', 'December to March', 350.00, 700.00, 1800.00, 4.5, 11800, 83, true),
(40, 'Nuwara Eliya', 'Nuwara Eliya', 'Sri Lanka', 'LK', 6.9497, 80.7891, 'Little England with tea plantations, cool climate, and colonial charm.', 'Asia/Colombo', 'Highland tropical', 'December to March, July to August', 300.00, 600.00, 1500.00, 4.3, 8700, 81, true),
(41, 'Pokhara', 'Pokhara', 'Nepal', 'NP', 28.2096, 83.9856, 'Gateway to Annapurna with lakes, mountains, and adventure activities.', 'Asia/Kathmandu', 'Subtropical', 'October to December, March to May', 250.00, 500.00, 1200.00, 4.4, 16800, 82, true),
(42, 'Chitwan', 'Bharatpur', 'Nepal', 'NP', 27.5291, 84.3542, 'National park famous for rhinos, tigers, and jungle safaris.', 'Asia/Kathmandu', 'Subtropical', 'October to March', 200.00, 400.00, 1000.00, 4.2, 9500, 78, true),
(43, 'Abu Dhabi', 'Abu Dhabi', 'United Arab Emirates', 'AE', 24.4539, 54.3773, 'UAE capital with Sheikh Zayed Mosque, Louvre, and cultural attractions.', 'Asia/Dubai', 'Desert', 'November to March', 2000.00, 4000.00, 10000.00, 4.4, 18900, 87, true),
(44, 'Sharjah', 'Sharjah', 'United Arab Emirates', 'AE', 25.3463, 55.4209, 'Cultural capital of UAE with museums, heritage areas, and art galleries.', 'Asia/Dubai', 'Desert', 'November to March', 1500.00, 3000.00, 7500.00, 4.2, 12400, 82, true),
(45, 'Muscat', 'Muscat', 'Oman', 'OM', 23.5859, 58.4059, 'Capital with Sultan Qaboos Grand Mosque, souks, and mountain landscapes.', 'Asia/Muscat', 'Desert', 'October to April', 1800.00, 3600.00, 9000.00, 4.3, 11200, 85, true);

-- Destination image updates (Wikipedia)
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/330px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg' WHERE id = 1; -- Paris
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg' WHERE id = 2; -- Tokyo
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg' WHERE id = 3; -- New York
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/330px-London_Skyline_%28125508655%29.jpeg' WHERE id = 4; -- London
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg/330px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg' WHERE id = 5; -- Barcelona
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/330px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg' WHERE id = 6; -- Rome
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/330px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg' WHERE id = 7; -- Sydney
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Historical_peninsula_and_modern_skyline_of_Istanbul.jpg/330px-Historical_peninsula_and_modern_skyline_of_Istanbul.jpg' WHERE id = 8; -- Istanbul
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bangkok_Montage_2024_2.jpg/330px-Bangkok_Montage_2024_2.jpg' WHERE id = 9; -- Bangkok
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/330px-Flag_of_Singapore.svg.png' WHERE id = 10; -- Singapore
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/330px-Burj_Khalifa_2021.jpg' WHERE id = 11; -- Dubai
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bukit_Bintang_junction_in_2024_2.jpg/330px-Bukit_Bintang_junction_in_2024_2.jpg' WHERE id = 12; -- Kuala Lumpur
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Colombo_skyline_2024.jpg/330px-Colombo_skyline_2024.jpg' WHERE id = 13; -- Colombo
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg/330px-Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg' WHERE id = 14; -- Kathmandu
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg/330px-Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg' WHERE id = 15; -- Ho Chi Minh City
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Bali_in_Indonesia_%28special_marker%29.svg/330px-Bali_in_Indonesia_%28special_marker%29.svg.png' WHERE id = 16; -- Bali
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/330px-Flag_of_Maldives.svg.png' WHERE id = 17; -- Maldives
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/330px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg' WHERE id = 18; -- Seoul
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/330px-Flag_of_Bhutan.svg.png' WHERE id = 19; -- Bhutan
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/The_Pearl_Marina_in_Nov_2013.jpg/330px-The_Pearl_Marina_in_Nov_2013.jpg' WHERE id = 20; -- Doha
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/%E0%A6%93%E0%A6%B0%E0%A6%B2%E0%A6%BF%E0%A6%B0_%E0%A6%97%E0%A6%97%E0%A6%A8%E0%A6%B0%E0%A7%88%E0%A6%96%E0%A6%BF%E0%A6%95_%E0%A6%A6%E0%A7%83%E0%A6%B6%E0%A7%8D%E0%A6%AF.jpg/330px-%E0%A6%93%E0%A6%B0%E0%A6%B2%E0%A6%BF%E0%A6%B0_%E0%A6%97%E0%A6%97%E0%A6%A8%E0%A6%B0%E0%A7%88%E0%A6%96%E0%A6%BF%E0%A6%95_%E0%A6%A6%E0%A7%83%E0%A6%B6%E0%A7%8D%E0%A6%AF.jpg' WHERE id = 21; -- Mumbai
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jama_Masjid_2011.jpg/330px-Jama_Masjid_2011.jpg' WHERE id = 22; -- Delhi
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/330px-BeachFun.jpg' WHERE id = 23; -- Goa
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Boathouse_%287063399547%29.jpg/330px-Boathouse_%287063399547%29.jpg' WHERE id = 24; -- Kerala
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Thar_Khuri.jpg/330px-Thar_Khuri.jpg' WHERE id = 25; -- Rajasthan
UPDATE destinations SET image_url = 'https://en.wikipedia.org/wiki/Special:FilePath/Pahalgam_Valley.jpg' WHERE id = 26; -- Kashmir
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg/330px-Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg' WHERE id = 27; -- Ladakh
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kinnaur_Kailash.jpg/330px-Kinnaur_Kailash.jpg' WHERE id = 28; -- Himachal Pradesh
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mamallapuram_view.jpg/330px-Mamallapuram_view.jpg' WHERE id = 29; -- Tamil Nadu
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/330px-Hampi_virupaksha_temple.jpg' WHERE id = 30; -- Karnataka
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Auli%2C_India.jpg/330px-Auli%2C_India.jpg' WHERE id = 31; -- Uttarakhand
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/330px-Tirumala_090615.jpg' WHERE id = 32; -- Andhra Pradesh
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Howrah_bridge_betwixt_Lights.jpg/330px-Howrah_bridge_betwixt_Lights.jpg' WHERE id = 33; -- West Bengal
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Rani_ki_vav_02.jpg/330px-Rani_ki_vav_02.jpg' WHERE id = 34; -- Gujarat
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Faisal_Mosque%2C_Islamabad_III.jpg/330px-Faisal_Mosque%2C_Islamabad_III.jpg' WHERE id = 35; -- Islamabad
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lahore_Fort_view_from_Baradari.jpg/330px-Lahore_Fort_view_from_Baradari.jpg' WHERE id = 36; -- Lahore
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Dolmen_Towers_Karachi.jpg/330px-Dolmen_Towers_Karachi.jpg' WHERE id = 37; -- Karachi
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/SL_Kandy_asv2020-01_img04_Queens_Hotel.jpg/330px-SL_Kandy_asv2020-01_img04_Queens_Hotel.jpg' WHERE id = 38; -- Kandy
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Galle_Fort.jpg/330px-Galle_Fort.jpg' WHERE id = 39; -- Galle
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Nuwara-e.jpg/330px-Nuwara-e.jpg' WHERE id = 40; -- Nuwara Eliya
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pokhara_Valley.jpg/330px-Pokhara_Valley.jpg' WHERE id = 41; -- Pokhara
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Chitwan_swamp.jpg/330px-Chitwan_swamp.jpg' WHERE id = 42; -- Chitwan
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Abu_dhabi_skylines_2014.jpg/330px-Abu_dhabi_skylines_2014.jpg' WHERE id = 43; -- Abu Dhabi
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Al_Qasba.jpg/330px-Al_Qasba.jpg' WHERE id = 44; -- Sharjah
UPDATE destinations SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Al_Alam_Palace.jpg/330px-Al_Alam_Palace.jpg' WHERE id = 45; -- Muscat
-- End destination image updates

-- Insert destination interests
INSERT INTO destination_interests (destination_id, interest) VALUES
(1, 'CULTURE'), (1, 'ART'), (1, 'FOOD'), (1, 'ROMANTIC'), (1, 'HISTORY'),
(2, 'CULTURE'), (2, 'FOOD'), (2, 'SHOPPING'), (2, 'ADVENTURE'), (2, 'BUSINESS'),
(3, 'CULTURE'), (3, 'SHOPPING'), (3, 'BUSINESS'), (3, 'ART'), (3, 'NIGHTLIFE'),
(4, 'HISTORY'), (4, 'CULTURE'), (4, 'ART'), (4, 'BUSINESS'), (4, 'MUSIC'),
(5, 'BEACH'), (5, 'ART'), (5, 'CULTURE'), (5, 'NIGHTLIFE'), (5, 'FOOD'),
(6, 'HISTORY'), (6, 'CULTURE'), (6, 'ART'), (6, 'FOOD'), (6, 'ROMANTIC'),
(7, 'BEACH'), (7, 'NATURE'), (7, 'ADVENTURE'), (7, 'SPORTS'), (7, 'FAMILY'),
(8, 'HISTORY'), (8, 'CULTURE'), (8, 'FOOD'), (8, 'SHOPPING'), (8, 'ART'),
-- Popular destinations from India
(9, 'FOOD'), (9, 'SHOPPING'), (9, 'CULTURE'), (9, 'NIGHTLIFE'), (9, 'ADVENTURE'),
(10, 'SHOPPING'), (10, 'FOOD'), (10, 'BUSINESS'), (10, 'CULTURE'), (10, 'FAMILY'),
(11, 'SHOPPING'), (11, 'LUXURY'), (11, 'BUSINESS'), (11, 'ADVENTURE'), (11, 'FOOD'),
(12, 'FOOD'), (12, 'SHOPPING'), (12, 'CULTURE'), (12, 'BUSINESS'), (12, 'FAMILY'),
(13, 'BEACH'), (13, 'CULTURE'), (13, 'HISTORY'), (13, 'NATURE'), (13, 'WELLNESS'),
(14, 'ADVENTURE'), (14, 'NATURE'), (14, 'CULTURE'), (14, 'HISTORY'), (14, 'WELLNESS'),
(15, 'FOOD'), (15, 'CULTURE'), (15, 'HISTORY'), (15, 'SHOPPING'), (15, 'ADVENTURE'),
(16, 'BEACH'), (16, 'WELLNESS'), (16, 'CULTURE'), (16, 'NATURE'), (16, 'ROMANTIC'),
(17, 'BEACH'), (17, 'LUXURY'), (17, 'ROMANTIC'), (17, 'WELLNESS'), (17, 'FAMILY'),
(18, 'CULTURE'), (18, 'SHOPPING'), (18, 'FOOD'), (18, 'BUSINESS'), (18, 'MUSIC'),
(19, 'NATURE'), (19, 'CULTURE'), (19, 'ADVENTURE'), (19, 'WELLNESS'), (19, 'HISTORY'),
(20, 'BUSINESS'), (20, 'SHOPPING'), (20, 'CULTURE'), (20, 'LUXURY'), (20, 'ART'),

-- Indian Destination Interests
(21, 'CULTURE'), (21, 'FOOD'), (21, 'BUSINESS'), (21, 'NIGHTLIFE'), (21, 'SHOPPING'),
(22, 'HISTORY'), (22, 'CULTURE'), (22, 'SHOPPING'), (22, 'BUSINESS'), (22, 'FOOD'),
(23, 'BEACH'), (23, 'NIGHTLIFE'), (23, 'FOOD'), (23, 'ADVENTURE'), (23, 'ROMANTIC'),
(24, 'NATURE'), (24, 'WELLNESS'), (24, 'CULTURE'), (24, 'ROMANTIC'), (24, 'FOOD'),
(25, 'HISTORY'), (25, 'CULTURE'), (25, 'LUXURY'), (25, 'ADVENTURE'), (25, 'ART'),
(26, 'NATURE'), (26, 'ROMANTIC'), (26, 'ADVENTURE'), (26, 'CULTURE'), (26, 'WELLNESS'),
(27, 'ADVENTURE'), (27, 'NATURE'), (27, 'CULTURE'), (27, 'HISTORY'), (27, 'WELLNESS'),
(28, 'NATURE'), (28, 'ADVENTURE'), (28, 'ROMANTIC'), (28, 'FAMILY'), (28, 'WELLNESS'),
(29, 'CULTURE'), (29, 'HISTORY'), (29, 'ART'), (29, 'FOOD'), (29, 'BUSINESS'),
(30, 'BUSINESS'), (30, 'CULTURE'), (30, 'NIGHTLIFE'), (30, 'FOOD'), (30, 'SHOPPING'),
(31, 'ADVENTURE'), (31, 'NATURE'), (31, 'WELLNESS'), (31, 'CULTURE'), (31, 'HISTORY'),
(32, 'CULTURE'), (32, 'FOOD'), (32, 'BUSINESS'), (32, 'HISTORY'), (32, 'SHOPPING'),
(33, 'CULTURE'), (33, 'HISTORY'), (33, 'ART'), (33, 'FOOD'), (33, 'BUSINESS'),
(34, 'CULTURE'), (34, 'NATURE'), (34, 'ADVENTURE'), (34, 'HISTORY'), (34, 'FOOD'),

-- Neighboring Countries Interests
(35, 'CULTURE'), (35, 'HISTORY'), (35, 'BUSINESS'), (35, 'NATURE'), (35, 'FOOD'),
(36, 'CULTURE'), (36, 'HISTORY'), (36, 'ART'), (36, 'FOOD'), (36, 'BUSINESS'),
(37, 'BUSINESS'), (37, 'CULTURE'), (37, 'BEACH'), (37, 'FOOD'), (37, 'SHOPPING'),
(38, 'CULTURE'), (38, 'HISTORY'), (38, 'NATURE'), (38, 'WELLNESS'), (38, 'ART'),
(39, 'HISTORY'), (39, 'BEACH'), (39, 'CULTURE'), (39, 'ROMANTIC'), (39, 'ART'),
(40, 'NATURE'), (40, 'WELLNESS'), (40, 'ROMANTIC'), (40, 'CULTURE'), (40, 'ADVENTURE'),
(41, 'ADVENTURE'), (41, 'NATURE'), (41, 'CULTURE'), (41, 'WELLNESS'), (41, 'ROMANTIC'),
(42, 'NATURE'), (42, 'ADVENTURE'), (42, 'FAMILY'), (42, 'CULTURE'), (42, 'WELLNESS'),
(43, 'CULTURE'), (43, 'ART'), (43, 'LUXURY'), (43, 'BUSINESS'), (43, 'SHOPPING'),
(44, 'CULTURE'), (44, 'ART'), (44, 'HISTORY'), (44, 'BUSINESS'), (44, 'SHOPPING'),
(45, 'CULTURE'), (45, 'HISTORY'), (45, 'NATURE'), (45, 'ADVENTURE'), (45, 'BUSINESS');

-- Insert sample hotels
INSERT INTO hotels (id, name, address, destination_id, latitude, longitude, description, star_rating, price_per_night, currency, average_rating, total_reviews, phone_number, website, available, featured, check_in_time, check_out_time) VALUES
(1, 'Grand Hotel Paris', '123 Champs-Élysées, Paris', 1, 48.8738, 2.2950, 'Luxury hotel in the heart of Paris with stunning city views.', 'FIVE', 350.00, 'USD', 4.6, 1250, '+33 1 42 86 10 00', 'https://grandhotelparis.com', true, true, '15:00', '11:00'),
(2, 'Paris Budget Inn', '45 Rue de la République, Paris', 1, 48.8634, 2.3318, 'Affordable accommodation near major attractions.', 'TWO', 85.00, 'USD', 4.1, 890, '+33 1 48 87 62 00', NULL, true, false, '14:00', '11:00'),
(3, 'Tokyo Imperial Suite', '1-1 Marunouchi, Tokyo', 2, 35.6812, 139.7671, 'Premium hotel overlooking the Imperial Palace.', 'FIVE', 420.00, 'USD', 4.7, 980, '+81 3-3211-5211', 'https://tokyoimperial.com', true, true, '15:00', '12:00'),
(4, 'Tokyo Capsule Hotel', '2-3 Shibuya, Tokyo', 2, 35.6598, 139.7036, 'Modern capsule hotel experience in Shibuya.', 'TWO', 65.00, 'USD', 4.0, 1200, '+81 3-3496-1010', NULL, true, false, '16:00', '10:00'),
(5, 'Manhattan Plaza Hotel', '768 5th Avenue, New York', 3, 40.7614, -73.9776, 'Iconic hotel near Central Park and Times Square.', 'FOUR', 280.00, 'USD', 4.4, 2100, '+1 212-759-3000', 'https://manhattanplaza.com', true, true, '15:00', '12:00'),
(6, 'London Royal Stay', '25 Piccadilly, London', 4, 51.5099, -0.1366, 'Traditional British hospitality in central London.', 'FOUR', 220.00, 'USD', 4.3, 1650, '+44 20 7493 8181', 'https://londonroyal.com', true, true, '14:00', '11:00'),
(7, 'Barcelona Beach Resort', 'Passeig Marítim, Barcelona', 5, 41.3825, 2.1769, 'Beachfront resort with Mediterranean views.', 'FOUR', 180.00, 'USD', 4.5, 1100, '+34 93 225 81 00', 'https://bcnbeach.com', true, true, '15:00', '12:00'),
(8, 'Rome Heritage Hotel', 'Via del Corso 126, Rome', 6, 41.9018, 12.4798, 'Historic hotel near the Pantheon and Trevi Fountain.', 'THREE', 150.00, 'USD', 4.2, 1400, '+39 06 699 23000', 'https://romeheritage.com', true, false, '14:00', '11:00'),
-- Hotels for popular destinations from India
(9, 'Bangkok Luxury Palace', 'Sukhumvit Road, Bangkok', 9, 13.7539, 100.5418, 'Luxury hotel in the heart of Bangkok with rooftop pool.', 'FIVE', 180.00, 'USD', 4.5, 2200, '+66 2 255 0000', 'https://bangkokluxury.com', true, true, '15:00', '12:00'),
(10, 'Bangkok Backpacker Inn', 'Khao San Road, Bangkok', 9, 13.7593, 100.4977, 'Budget-friendly hostel in the backpacker district.', 'TWO', 25.00, 'USD', 4.1, 1500, '+66 2 629 0326', NULL, true, false, '14:00', '11:00'),
(11, 'Marina Bay Sands', '10 Bayfront Avenue, Singapore', 10, 1.2834, 103.8607, 'Iconic hotel with infinity pool and skyline views.', 'FIVE', 400.00, 'USD', 4.6, 3200, '+65 6688 8868', 'https://marinabaysands.com', true, true, '15:00', '11:00'),
(12, 'Singapore Budget Stay', 'Chinatown, Singapore', 10, 1.2817, 103.8448, 'Clean and affordable accommodation in Chinatown.', 'THREE', 80.00, 'USD', 4.2, 950, '+65 6221 3927', NULL, true, false, '14:00', '11:00'),
(13, 'Burj Al Arab Dubai', 'Jumeirah Beach Road, Dubai', 11, 25.1413, 55.1855, 'Worlds most luxurious hotel shaped like a sail.', 'FIVE', 1200.00, 'USD', 4.8, 2800, '+971 4 301 7777', 'https://burjalarab.com', true, true, '15:00', '12:00'),
(14, 'Dubai City Hotel', 'Deira, Dubai', 11, 25.2690, 55.3095, 'Modern hotel in the commercial district of Dubai.', 'FOUR', 150.00, 'USD', 4.3, 1800, '+971 4 295 6666', 'https://dubaicity.com', true, false, '14:00', '11:00'),
(15, 'Bali Beachfront Resort', 'Seminyak Beach, Bali', 16, -8.6917, 115.1675, 'Luxury beachfront resort with spa and infinity pool.', 'FIVE', 220.00, 'USD', 4.7, 1900, '+62 361 730 840', 'https://balibeach.com', true, true, '15:00', '12:00'),
(16, 'Bali Surf Hostel', 'Canggu, Bali', 16, -8.6482, 115.1342, 'Surfer-friendly hostel steps from the beach.', 'TWO', 35.00, 'USD', 4.3, 1200, '+62 361 844 6633', NULL, true, false, '14:00', '11:00'),
(17, 'Maldives Water Villa Resort', 'North Malé Atoll', 17, 4.2105, 73.4426, 'Overwater bungalows with direct ocean access.', 'FIVE', 800.00, 'USD', 4.8, 1100, '+960 664 2788', 'https://maldivesvilla.com', true, true, '14:00', '12:00'),
(18, 'Seoul Palace Hotel', 'Gangnam District, Seoul', 18, 37.5172, 127.0473, 'Modern hotel in trendy Gangnam with city views.', 'FOUR', 160.00, 'USD', 4.4, 1600, '+82 2 555 5656', 'https://seoulpalace.com', true, true, '15:00', '11:00'),

-- Indian Hotels
(19, 'Taj Mahal Palace Mumbai', 'Apollo Bunder, Mumbai', 21, 19.0896, 72.8656, 'Iconic luxury hotel overlooking the Gateway of India.', 'FIVE', 12000.00, 'INR', 4.8, 2800, '+91 22 6665 3366', 'https://tajhotels.com', true, true, '15:00', '12:00'),
(20, 'Hotel Mumbai Central', 'Andheri East, Mumbai', 21, 19.1136, 72.8697, 'Modern business hotel near airport with city connectivity.', 'FOUR', 4500.00, 'INR', 4.3, 1200, '+91 22 2836 3636', 'https://mumbaicentral.com', true, false, '14:00', '11:00'),
(21, 'The Leela Palace New Delhi', 'Chanakyapuri, New Delhi', 22, 28.5959, 77.1709, 'Luxury hotel near diplomatic enclave with royal architecture.', 'FIVE', 15000.00, 'INR', 4.7, 2200, '+91 11 3933 1234', 'https://theleela.com', true, true, '15:00', '12:00'),
(22, 'Hotel Delhi Budget', 'Paharganj, New Delhi', 22, 28.6448, 77.2167, 'Budget accommodation near New Delhi Railway Station.', 'TWO', 1800.00, 'INR', 4.0, 800, '+91 11 2358 2930', NULL, true, false, '12:00', '11:00'),
(23, 'Taj Exotica Goa', 'Benaulim Beach, Goa', 23, 15.2560, 73.9194, 'Beachfront resort with Portuguese-inspired architecture.', 'FIVE', 18000.00, 'INR', 4.6, 1800, '+91 832 277 1234', 'https://tajhotels.com', true, true, '15:00', '12:00'),
(24, 'Goa Beach Hostel', 'Baga Beach, Goa', 23, 15.5559, 73.7514, 'Backpacker hostel steps from the beach with party vibes.', 'ONE', 800.00, 'INR', 4.2, 1500, '+91 832 227 8855', NULL, true, false, '14:00', '10:00'),
(25, 'Kumarakom Lake Resort', 'Kumarakom, Kerala', 24, 9.6177, 76.4281, 'Heritage resort on Vembanad Lake with traditional Kerala architecture.', 'FIVE', 16000.00, 'INR', 4.7, 1600, '+91 481 252 4900', 'https://kumarakomlakeresort.in', true, true, '14:00', '12:00'),
(26, 'Kerala Backwater Stay', 'Alleppey, Kerala', 24, 9.4981, 76.3388, 'Traditional houseboat experience in the backwaters.', 'THREE', 3500.00, 'INR', 4.4, 900, '+91 477 223 3636', NULL, true, false, '12:00', '11:00'),
(27, 'Umaid Bhawan Palace', 'Jodhpur, Rajasthan', 25, 26.2790, 73.0181, 'Heritage palace hotel offering royal experience.', 'FIVE', 25000.00, 'INR', 4.8, 1200, '+91 291 251 0101', 'https://tajhotels.com', true, true, '15:00', '12:00'),
(28, 'Rajasthan Heritage Hotel', 'Jaipur, Rajasthan', 25, 26.9124, 75.7873, 'Traditional haveli converted into boutique hotel.', 'FOUR', 6500.00, 'INR', 4.4, 1100, '+91 141 237 3637', 'https://rajheritage.com', true, false, '14:00', '11:00'),
(29, 'Vivanta Dal View', 'Dal Lake, Srinagar', 26, 34.0912, 74.8061, 'Luxury hotel with stunning views of Dal Lake and mountains.', 'FIVE', 14000.00, 'INR', 4.6, 800, '+91 194 250 1001', 'https://vivantahotels.com', true, true, '14:00', '12:00'),
(30, 'Kashmir Houseboat', 'Dal Lake, Srinagar', 26, 34.0837, 74.7973, 'Traditional Kashmiri houseboat experience on Dal Lake.', 'THREE', 4000.00, 'INR', 4.5, 600, '+91 194 245 2525', NULL, true, false, '12:00', '11:00'),
(31, 'The Grand Dragon Ladakh', 'Leh, Ladakh', 27, 34.1642, 77.5844, 'Luxury hotel with oxygen-enriched rooms for high altitude comfort.', 'FIVE', 12000.00, 'INR', 4.5, 400, '+91 198 225 7666', 'https://granddragonladakh.com', true, true, '14:00', '11:00'),
(32, 'Ladakh Guest House', 'Leh Main Bazaar, Ladakh', 27, 34.1526, 77.5770, 'Budget accommodation in the heart of Leh with mountain views.', 'TWO', 2000.00, 'INR', 4.1, 300, '+91 198 225 2929', NULL, true, false, '12:00', '10:00'),

-- Neighboring Countries Hotels
(33, 'Islamabad Serena Hotel', 'Khayaban-e-Suharwardy, Islamabad', 35, 33.7077, 73.0563, 'Luxury hotel in the diplomatic enclave with modern amenities.', 'FIVE', 15000.00, 'PKR', 4.4, 600, '+92 51 287 4000', 'https://serena.com.pk', true, true, '15:00', '12:00'),
(34, 'Falettis Hotel Lahore', 'Egerton Road, Lahore', 36, 31.5656, 74.3242, 'Historic luxury hotel in the heart of Lahore since 1880.', 'FOUR', 8000.00, 'PKR', 4.3, 800, '+92 42 631 0000', 'https://falettis.com', true, true, '14:00', '11:00'),
(35, 'Hotel One Karachi', 'Shahrah-e-Faisal, Karachi', 37, 24.9056, 67.0822, 'Modern hotel near Karachi Airport with business facilities.', 'FOUR', 6000.00, 'PKR', 4.2, 500, '+92 21 3454 0505', 'https://hotelone.com.pk', true, false, '14:00', '11:00'),
(36, 'Queens Hotel Kandy', 'Dalada Veediya, Kandy', 38, 7.2955, 80.6350, 'Colonial-era hotel overlooking Kandy Lake and Temple of Tooth.', 'FOUR', 8000.00, 'LKR', 4.4, 700, '+94 81 223 3026', 'https://queenshotel.lk', true, true, '14:00', '11:00'),
(37, 'Amangalla Galle', 'Church Street, Galle Fort', 39, 6.0266, 80.2170, 'Luxury heritage hotel within the historic Galle Fort.', 'FIVE', 45000.00, 'LKR', 4.8, 400, '+94 91 223 3388', 'https://aman.com', true, true, '15:00', '12:00'),
(38, 'Grand Hotel Nuwara Eliya', 'Grand Hotel Road, Nuwara Eliya', 40, 6.9734, 80.7609, 'Colonial heritage hotel in the heart of tea country.', 'FOUR', 12000.00, 'LKR', 4.3, 600, '+94 52 222 2881', 'https://grandhotel.lk', true, true, '14:00', '11:00'),
(39, 'Temple Tree Resort', 'Lakeside, Pokhara', 41, 28.2092, 83.9591, 'Eco-friendly resort with views of Annapurna and Pokhara Lake.', 'FOUR', 4500.00, 'NPR', 4.5, 800, '+977 61 465 819', 'https://templetree.com.np', true, true, '14:00', '11:00'),
(40, 'Emirates Palace Abu Dhabi', 'Corniche Road West, Abu Dhabi', 43, 24.4622, 54.3178, 'Ultra-luxury palace hotel with gold-plated interiors.', 'FIVE', 2200.00, 'AED', 4.7, 1500, '+971 2 690 9000', 'https://emiratespalace.com', true, true, '15:00', '12:00'),

-- Additional hotels for better coverage (3-4 per city)
-- Mumbai additional hotels
(41, 'The Oberoi Mumbai', 'Nariman Point, Mumbai', 21, 19.0216, 72.8221, 'Luxury business hotel with sea views and premium amenities.', 'FIVE', 18000.00, 'INR', 4.6, 1800, '+91 22 6632 5757', 'https://oberoihotels.com', true, true, '15:00', '12:00'),
(42, 'JW Marriott Mumbai Sahar', 'IA Project Road, Mumbai', 21, 19.0896, 72.8656, 'Contemporary luxury near airport with rooftop pool.', 'FIVE', 14000.00, 'INR', 4.5, 2100, '+91 22 6693 3000', 'https://marriott.com', true, true, '15:00', '12:00'),
(43, 'Hotel Suba Palace', 'Apollo Bunder, Mumbai', 21, 19.0876, 72.8653, 'Heritage property near Gateway with colonial charm.', 'THREE', 3500.00, 'INR', 4.2, 950, '+91 22 6630 0636', 'https://subapalace.com', true, false, '14:00', '11:00'),

-- Delhi additional hotels
(44, 'The Imperial New Delhi', 'Janpath, New Delhi', 22, 28.6139, 77.2176, 'Art Deco masterpiece with expansive gardens.', 'FIVE', 20000.00, 'INR', 4.8, 2400, '+91 11 2334 1234', 'https://theimperialindia.com', true, true, '15:00', '12:00'),
(45, 'ITC Maurya New Delhi', 'Sardar Patel Marg, Delhi', 22, 28.5967, 77.1667, 'Luxury hotel with award-winning restaurants.', 'FIVE', 16000.00, 'INR', 4.6, 1900, '+91 11 2611 2233', 'https://itchotels.com', true, true, '15:00', '12:00'),
(46, 'Hotel Tara Palace', 'Chandni Chowk, Delhi', 22, 28.6562, 77.2315, 'Boutique hotel in historic Old Delhi area.', 'THREE', 2800.00, 'INR', 4.1, 750, '+91 11 4567 8901', NULL, true, false, '12:00', '11:00'),

-- Goa additional hotels
(47, 'The Leela Goa', 'Mobor Beach, Goa', 23, 15.1641, 73.9464, 'Beachfront luxury resort with lagoon-style pools.', 'FIVE', 22000.00, 'INR', 4.7, 2200, '+91 832 287 1234', 'https://theleela.com', true, true, '15:00', '12:00'),
(48, 'Grand Hyatt Goa', 'Bambolim Beach, Goa', 23, 15.4167, 73.8667, 'Contemporary resort with private beach access.', 'FIVE', 16000.00, 'INR', 4.5, 1600, '+91 832 272 1234', 'https://hyatt.com', true, true, '15:00', '12:00'),
(49, 'Casa Anjuna Hotel', 'Anjuna Beach, Goa', 23, 15.5733, 73.7397, 'Boutique beachside hotel with Portuguese architecture.', 'FOUR', 8500.00, 'INR', 4.3, 1200, '+91 832 227 4736', 'https://casaanjuna.com', true, false, '14:00', '11:00'),

-- Kerala additional hotels
(50, 'Taj Malabar Resort & Spa', 'Willingdon Island, Kochi', 24, 9.9648, 76.2509, 'Heritage resort on private island with harbor views.', 'FIVE', 18000.00, 'INR', 4.6, 1400, '+91 484 664 3000', 'https://tajhotels.com', true, true, '15:00', '12:00'),
(51, 'Spice Village Thekkady', 'Kumily, Kerala', 24, 9.5938, 77.1562, 'Eco-resort in spice plantations near Periyar.', 'FOUR', 11000.00, 'INR', 4.5, 800, '+91 486 922 2315', 'https://cghearth.com', true, true, '14:00', '11:00'),
(52, 'Backwater Ripples Alleppey', 'Punnamada Lake, Kerala', 24, 9.4983, 76.3349, 'Lake-facing resort with traditional Kerala hospitality.', 'THREE', 5500.00, 'INR', 4.2, 640, '+91 477 225 3636', NULL, true, false, '12:00', '11:00'),

-- Rajasthan additional hotels
(53, 'Rambagh Palace Jaipur', 'Bhawani Singh Road, Jaipur', 25, 26.8851, 75.8073, 'Former maharaja palace turned luxury hotel.', 'FIVE', 28000.00, 'INR', 4.8, 1800, '+91 141 221 1919', 'https://tajhotels.com', true, true, '15:00', '12:00'),
(54, 'Fairmont Jaipur', 'Riico Kukas, Jaipur', 25, 26.9904, 75.6865, 'Palatial resort inspired by Mughal architecture.', 'FIVE', 20000.00, 'INR', 4.6, 1400, '+91 141 717 0000', 'https://fairmont.com', true, true, '15:00', '12:00'),
(55, 'Alsisar Haveli Jaipur', 'Sansar Chandra Road, Jaipur', 25, 26.9196, 75.8073, 'Heritage haveli with traditional Rajasthani decor.', 'FOUR', 9500.00, 'INR', 4.4, 950, '+91 141 236 8290', 'https://alsisarhaveli.com', true, false, '14:00', '11:00'),

-- Kashmir additional hotels
(56, 'The LaLiT Grand Palace', 'Gupkar Road, Srinagar', 26, 34.0837, 74.8146, 'Former maharaja palace with panoramic lake views.', 'FIVE', 18000.00, 'INR', 4.7, 600, '+91 194 250 1001', 'https://thelalit.com', true, true, '14:00', '12:00'),
(57, 'Fortune Resort Heevan', 'Srinagar-Gulmarg Road, Kashmir', 26, 34.1247, 74.7519, 'Mountain resort with apple orchards and valley views.', 'FOUR', 12000.00, 'INR', 4.4, 450, '+91 194 246 1247', 'https://fortunehotels.in', true, false, '14:00', '11:00'),
(58, 'Houseboat New jackie', 'Nagin Lake, Srinagar', 26, 34.1200, 74.8200, 'Luxury houseboat with carved walnut interiors.', 'FOUR', 6500.00, 'INR', 4.6, 380, '+91 194 247 2525', NULL, true, false, '12:00', '11:00'),

-- Thailand (Bangkok) additional hotels  
(59, 'The Siam Bangkok', 'Khlong San District, Bangkok', 9, 13.7307, 100.5018, 'Art deco luxury hotel on Chao Phraya River.', 'FIVE', 8500.00, 'THB', 4.8, 900, '+66 2 206 6999', 'https://thesiamhotel.com', true, true, '15:00', '12:00'),
(60, 'Shangri-La Bangkok', 'Saphan Taksin, Bangkok', 9, 13.7198, 100.5156, 'Riverside luxury with tropical gardens and spa.', 'FIVE', 6800.00, 'THB', 4.6, 2100, '+66 2 236 7777', 'https://shangri-la.com', true, true, '15:00', '12:00'),
(61, 'Lub d Bangkok Siam', 'Siam Square, Bangkok', 9, 13.7461, 100.5348, 'Modern hostel with pods and social spaces.', 'TWO', 1200.00, 'THB', 4.3, 1800, '+66 2 612 4999', 'https://lubd.com', true, false, '14:00', '11:00');

-- Insert hotel amenities
INSERT INTO hotel_amenities (hotel_id, amenity) VALUES
(1, 'WIFI'), (1, 'POOL'), (1, 'SPA'), (1, 'RESTAURANT'), (1, 'ROOM_SERVICE'), (1, 'CONCIERGE'), (1, 'BUSINESS_CENTER'), (1, 'PARKING'),
(2, 'WIFI'), (2, 'BREAKFAST_INCLUDED'), (2, 'AIR_CONDITIONING'),
(3, 'WIFI'), (3, 'POOL'), (3, 'GYM'), (3, 'SPA'), (3, 'RESTAURANT'), (3, 'BAR'), (3, 'ROOM_SERVICE'), (3, 'CONCIERGE'), (3, 'BUSINESS_CENTER'),
(4, 'WIFI'), (4, 'AIR_CONDITIONING'), (4, 'BREAKFAST_INCLUDED'),
(5, 'WIFI'), (5, 'GYM'), (5, 'RESTAURANT'), (5, 'BAR'), (5, 'ROOM_SERVICE'), (5, 'CONCIERGE'), (5, 'BUSINESS_CENTER'), (5, 'PARKING'),
(6, 'WIFI'), (6, 'GYM'), (6, 'RESTAURANT'), (6, 'BAR'), (6, 'ROOM_SERVICE'), (6, 'CONCIERGE'), (6, 'PARKING'),
(7, 'WIFI'), (7, 'POOL'), (7, 'BEACHFRONT'), (7, 'SPA'), (7, 'RESTAURANT'), (7, 'BAR'), (7, 'PARKING'),
(8, 'WIFI'), (8, 'RESTAURANT'), (8, 'AIR_CONDITIONING'), (8, 'PARKING'),
-- Amenities for new hotels
(9, 'WIFI'), (9, 'POOL'), (9, 'SPA'), (9, 'RESTAURANT'), (9, 'BAR'), (9, 'GYM'), (9, 'ROOM_SERVICE'), (9, 'CONCIERGE'),
(10, 'WIFI'), (10, 'BREAKFAST_INCLUDED'), (10, 'AIR_CONDITIONING'), (10, 'LAUNDRY'),
(11, 'WIFI'), (11, 'POOL'), (11, 'SPA'), (11, 'RESTAURANT'), (11, 'BAR'), (11, 'GYM'), (11, 'ROOM_SERVICE'), (11, 'CONCIERGE'), (11, 'BUSINESS_CENTER'),
(12, 'WIFI'), (12, 'BREAKFAST_INCLUDED'), (12, 'AIR_CONDITIONING'), (12, 'LAUNDRY'), (12, 'RESTAURANT'),
(13, 'WIFI'), (13, 'POOL'), (13, 'SPA'), (13, 'RESTAURANT'), (13, 'BAR'), (13, 'GYM'), (13, 'ROOM_SERVICE'), (13, 'CONCIERGE'), (13, 'BUSINESS_CENTER'), (13, 'BEACHFRONT'),
(14, 'WIFI'), (14, 'POOL'), (14, 'GYM'), (14, 'RESTAURANT'), (14, 'BAR'), (14, 'BUSINESS_CENTER'), (14, 'PARKING'),
(15, 'WIFI'), (15, 'POOL'), (15, 'SPA'), (15, 'RESTAURANT'), (15, 'BAR'), (15, 'BEACHFRONT'), (15, 'ROOM_SERVICE'),
(16, 'WIFI'), (16, 'BREAKFAST_INCLUDED'), (16, 'AIR_CONDITIONING'), (16, 'BEACHFRONT'),
(17, 'WIFI'), (17, 'SPA'), (17, 'RESTAURANT'), (17, 'BAR'), (17, 'ROOM_SERVICE'), (17, 'BEACHFRONT'), (17, 'POOL'),
(18, 'WIFI'), (18, 'POOL'), (18, 'GYM'), (18, 'RESTAURANT'), (18, 'BAR'), (18, 'BUSINESS_CENTER'), (18, 'PARKING');

-- Insert hotel images with real Unsplash URLs
INSERT INTO hotel_images (hotel_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
(2, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
(3, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
(4, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'),
(5, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
(6, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
(7, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'),
(8, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'),
-- Indian Hotels Images
(19, 'https://lh3.googleusercontent.com/p/AF1QipMK1ySAtAw-z_kv8wBwEXvLg9wMPbv9dV4SdB4O=s1360-w1360-h1020-rw'), -- Taj Mahal Palace Mumbai
(20, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'), -- Hotel Mumbai Central
(21, 'https://images.unsplash.com/photo-1549294413-26f195200c16'), -- Leela Palace Delhi
(22, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'), -- Delhi Budget
(23, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'), -- Taj Exotica Goa  
(24, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'), -- Goa Beach Hostel
(25, 'https://lh3.googleusercontent.com/p/AF1QipNtlzOi08P33OONjRmvFEMj842i4OGczcYJ6Mm6=s1360-w1360-h1020-rw'), -- Kumarakom Lake Resort
(26, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'), -- Kerala Backwater Stay
(27, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6'), -- Umaid Bhawan Palace
(28, 'https://images.unsplash.com/photo-1582719508461-905c673771fd'), -- Rajasthan Heritage
(29, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'), -- Vivanta Dal View
(30, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'), -- Kashmir Houseboat
(31, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'), -- Grand Dragon Ladakh
(32, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'), -- Ladakh Guest House
-- Additional hotel images
(41, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6'), -- Oberoi Mumbai
(42, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'), -- JW Marriott Mumbai
(43, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'), -- Suba Palace
(44, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'), -- Imperial Delhi
(45, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'), -- ITC Maurya
(46, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'), -- Tara Palace
(47, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6'), -- Leela Goa
(48, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'), -- Grand Hyatt Goa
(49, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'), -- Casa Anjuna
(50, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c'), -- Taj Malabar
(51, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'), -- Spice Village
(52, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'), -- Backwater Ripples
(53, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6'), -- Rambagh Palace
(54, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'), -- Fairmont Jaipur
(55, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'), -- Alsisar Haveli
(56, 'https://images.unsplash.com/photo-1455587734955-081b22074882'), -- LaLiT Grand Palace
(57, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'), -- Fortune Heevan
(58, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'), -- New Jackie Houseboat
(59, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6'), -- Siam Bangkok
(60, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'), -- Shangri-La Bangkok
(61, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'); -- Lub d Bangkok

-- Insert sample rooms
INSERT INTO rooms (id, hotel_id, room_number, room_type, description, max_occupancy, number_of_beds, bed_type, room_size_sqm, base_price, currency, available, smoking_allowed, pet_friendly) VALUES
(1, 1, '101', 'SUITE', 'Luxury suite with city view', 4, 2, 'KING', 75, 350.00, 'USD', true, false, false),
(2, 1, '102', 'DELUXE', 'Deluxe room with balcony', 2, 1, 'QUEEN', 45, 280.00, 'USD', true, false, false),
(3, 2, '201', 'STANDARD', 'Standard room with essential amenities', 2, 1, 'DOUBLE', 25, 85.00, 'USD', true, false, false),
(4, 2, '202', 'TWIN', 'Twin room for friends or colleagues', 2, 2, 'TWIN', 30, 90.00, 'USD', true, false, false),
(5, 3, '301', 'PRESIDENTIAL_SUITE', 'Presidential suite with panoramic views', 6, 3, 'KING', 120, 800.00, 'USD', true, false, true),
(6, 3, '302', 'DELUXE', 'Modern deluxe room', 2, 1, 'KING', 50, 420.00, 'USD', true, false, false),
(7, 4, 'C001', 'STUDIO', 'Capsule pod with modern amenities', 1, 1, 'SINGLE', 8, 65.00, 'USD', true, false, false),
(8, 5, '501', 'SUITE', 'Manhattan suite with Central Park view', 4, 2, 'KING', 80, 450.00, 'USD', true, false, false);

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity) VALUES
(1, 'PRIVATE_BATHROOM'), (1, 'BALCONY'), (1, 'CITY_VIEW'), (1, 'MINI_BAR'), (1, 'SAFE'), (1, 'TV'), (1, 'WIFI'), (1, 'AIR_CONDITIONING'),
(2, 'PRIVATE_BATHROOM'), (2, 'BALCONY'), (2, 'TV'), (2, 'WIFI'), (2, 'AIR_CONDITIONING'), (2, 'MINI_BAR'),
(3, 'PRIVATE_BATHROOM'), (3, 'TV'), (3, 'WIFI'), (3, 'AIR_CONDITIONING'),
(4, 'PRIVATE_BATHROOM'), (4, 'TV'), (4, 'WIFI'), (4, 'AIR_CONDITIONING'),
(5, 'PRIVATE_BATHROOM'), (5, 'BALCONY'), (5, 'CITY_VIEW'), (5, 'MINI_BAR'), (5, 'SAFE'), (5, 'TV'), (5, 'WIFI'), (5, 'AIR_CONDITIONING'), (5, 'KITCHENETTE'),
(6, 'PRIVATE_BATHROOM'), (6, 'TV'), (6, 'WIFI'), (6, 'AIR_CONDITIONING'), (6, 'MINI_BAR'), (6, 'SAFE'),
(7, 'PRIVATE_BATHROOM'), (7, 'TV'), (7, 'WIFI'), (7, 'AIR_CONDITIONING'),
(8, 'PRIVATE_BATHROOM'), (8, 'BALCONY'), (8, 'CITY_VIEW'), (8, 'MINI_BAR'), (8, 'SAFE'), (8, 'TV'), (8, 'WIFI'), (8, 'AIR_CONDITIONING');

-- Insert sample attractions
INSERT INTO attractions (id, name, description, destination_id, address, latitude, longitude, attraction_type, entry_fee, currency, free_entry, opening_hours, operating_days, average_rating, total_reviews, wheelchair_accessible, kids_friendly, recommended_duration_hours, best_time_to_visit, active, featured) VALUES
(1, 'Eiffel Tower', 'Iconic iron lattice tower and symbol of Paris', 1, 'Champ de Mars, 5 Avenue Anatole France', 48.8584, 2.2945, 'MONUMENT', 29.40, 'USD', false, '09:30 - 23:45', 'Mon-Sun', 4.5, 45820, true, true, 2, 'Early morning or sunset', true, true),
(2, 'Louvre Museum', 'World largest art museum and historic monument', 1, 'Rue de Rivoli', 48.8606, 2.3376, 'MUSEUM', 17.00, 'USD', false, '09:00 - 18:00', 'Mon,Thu-Sun', 4.4, 38950, true, true, 4, 'Early morning', true, true),
(3, 'Senso-ji Temple', 'Ancient Buddhist temple in Asakusa', 2, '2-3-1 Asakusa, Taito City', 35.7148, 139.7967, 'TEMPLE', 0.00, 'USD', true, '06:00 - 17:00', 'Mon-Sun', 4.3, 12450, false, true, 1, 'Early morning', true, true),
(4, 'Tokyo Skytree', 'Broadcasting tower and observation deck', 2, '1-1-2 Oshiage, Sumida City', 35.7101, 139.8107, 'BUILDING', 25.00, 'USD', false, '08:00 - 22:00', 'Mon-Sun', 4.2, 15670, true, true, 2, 'Clear weather days', true, false),
(5, 'Central Park', 'Large public park in Manhattan', 3, 'New York, NY 10024', 40.7812, -73.9665, 'PARK', 0.00, 'USD', true, '06:00 - 01:00', 'Mon-Sun', 4.6, 28340, true, true, 3, 'Spring and fall', true, true),
(6, 'Statue of Liberty', 'Colossal neoclassical sculpture on Liberty Island', 3, 'Liberty Island', 40.6892, -74.0445, 'MONUMENT', 23.50, 'USD', false, '08:30 - 16:00', 'Mon-Sun', 4.5, 22180, true, true, 3, 'Morning hours', true, true),
(7, 'British Museum', 'Museum of human history, art and culture', 4, 'Great Russell St', 51.5194, -0.1270, 'MUSEUM', 0.00, 'USD', true, '10:00 - 17:00', 'Mon-Sun', 4.4, 19870, true, true, 3, 'Weekday mornings', true, true),
(8, 'Tower of London', 'Historic castle on the north bank of River Thames', 4, 'St Katharine & Wapping', 51.5081, -0.0759, 'CASTLE', 29.90, 'USD', false, '09:00 - 17:30', 'Tue-Sat', 4.3, 16540, true, true, 3, 'Early morning', true, false),

-- Indian Attractions
(9, 'Gateway of India', 'Iconic arch monument overlooking Mumbai Harbor', 21, 'Apollo Bunder, Mumbai', 19.0895, 72.8656, 'MONUMENT', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.4, 15600, true, true, 1, 'Sunrise and sunset', true, true),
(10, 'Elephanta Caves', 'Ancient rock-cut caves dedicated to Lord Shiva', 21, 'Elephanta Island, Mumbai', 18.9633, 72.9374, 'TEMPLE', 40.00, 'INR', false, '09:00 - 17:30', 'Tue-Sun', 4.3, 8900, false, true, 4, 'Morning hours', true, true),
(11, 'Marine Drive', 'Scenic waterfront promenade known as Queens Necklace', 21, 'Netaji Subhashchandra Bose Road, Mumbai', 19.0176, 72.8562, 'STREET', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.5, 22400, true, true, 2, 'Evening and night', true, false),
(12, 'Red Fort', 'Magnificent Mughal fortress and UNESCO World Heritage Site', 22, 'Netaji Subhash Marg, Delhi', 28.6562, 77.2410, 'CASTLE', 35.00, 'INR', false, '09:30 - 16:30', 'Tue-Sun', 4.4, 28700, true, true, 2, 'Morning hours', true, true),
(13, 'India Gate', 'War memorial arch honoring Indian soldiers', 22, 'Rajpath, Delhi', 28.6129, 77.2295, 'MONUMENT', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.3, 35600, true, true, 1, 'Evening time', true, true),
(14, 'Qutub Minar', 'Tallest brick minaret in the world, UNESCO Heritage Site', 22, 'Mehrauli, Delhi', 28.5245, 77.1855, 'MONUMENT', 35.00, 'INR', false, '07:00 - 17:00', 'Mon-Sun', 4.2, 18900, true, true, 2, 'Morning hours', true, false),
(15, 'Basilica of Bom Jesus', 'UNESCO World Heritage Church housing St. Francis Xavier', 23, 'Bainguinim, Goa', 15.5007, 73.9114, 'CHURCH', 5.00, 'INR', false, '09:00 - 18:30', 'Mon-Sat', 4.5, 12300, true, true, 1, 'Morning hours', true, true),
(16, 'Dudhsagar Falls', 'Four-tiered waterfall on Mandovi River', 23, 'Bhagwan Mahaveer Sanctuary, Goa', 15.3144, 74.3144, 'WATERFALL', 30.00, 'INR', false, '09:00 - 17:00', 'Mon-Sun', 4.6, 9800, false, true, 4, 'Post-monsoon', true, true),
(17, 'Baga Beach', 'Famous beach known for water sports and nightlife', 23, 'Baga, Goa', 15.5559, 73.7514, 'BEACH', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.4, 18700, true, true, 3, 'Sunset hours', true, false),
(18, 'Kerala Backwaters', 'Network of lagoons, lakes and canals', 24, 'Alleppey, Kerala', 9.4981, 76.3388, 'LAKE', 500.00, 'INR', false, '06:00 - 18:00', 'Mon-Sun', 4.7, 16400, true, true, 6, 'Early morning', true, true),
(19, 'Munnar Tea Gardens', 'Scenic hill station with sprawling tea plantations', 24, 'Munnar, Kerala', 10.0889, 77.0595, 'GARDEN', 25.00, 'INR', false, '08:00 - 17:00', 'Mon-Sun', 4.6, 13600, true, true, 3, 'Morning hours', true, true),
(20, 'Chinese Fishing Nets', 'Iconic cantilever fishing nets at Fort Kochi', 24, 'Fort Kochi, Kerala', 9.9648, 76.2424, 'HISTORICAL_SITE', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.3, 8900, true, true, 1, 'Sunset time', true, false),
(21, 'Hawa Mahal', 'Palace of Winds with intricate pink sandstone architecture', 25, 'Hawa Mahal Road, Jaipur', 26.9239, 75.8267, 'PALACE', 50.00, 'INR', false, '09:00 - 16:30', 'Mon-Sun', 4.4, 24500, true, true, 1.5, 'Morning hours', true, true),
(22, 'City Palace Jaipur', 'Royal residence with museums and courtyards', 25, 'Tulsi Marg, Jaipur', 26.9258, 75.8235, 'PALACE', 200.00, 'INR', false, '09:30 - 17:00', 'Mon-Sun', 4.5, 19800, true, true, 2.5, 'Morning hours', true, true),
(23, 'Amber Fort', 'Hilltop fort with stunning architecture and elephant rides', 25, 'Devisinghpura, Amer', 26.9855, 75.8513, 'CASTLE', 100.00, 'INR', false, '08:00 - 18:00', 'Mon-Sun', 4.6, 22100, true, true, 3, 'Morning hours', true, true),
(24, 'Dal Lake', 'Iconic lake with houseboats and Shikara rides', 26, 'Srinagar, Kashmir', 34.0912, 74.8061, 'LAKE', 300.00, 'INR', false, '06:00 - 19:00', 'Mon-Sun', 4.7, 18900, true, true, 3, 'Early morning', true, true),
(25, 'Mughal Gardens', 'Terraced gardens built by Mughal emperors', 26, 'Srinagar, Kashmir', 34.0837, 74.8370, 'GARDEN', 25.00, 'INR', false, '09:00 - 19:00', 'Mon-Sun', 4.5, 12400, true, true, 2, 'Spring season', true, false),
(26, 'Gulmarg', 'Meadow of flowers and premier ski destination', 26, 'Gulmarg, Kashmir', 34.0484, 74.3806, 'MOUNTAIN', 80.00, 'INR', false, '09:00 - 17:00', 'Mon-Sun', 4.6, 15600, true, true, 4, 'Winter for skiing', true, true),
(27, 'Leh Palace', 'Former royal palace overlooking Leh town', 27, 'Leh, Ladakh', 34.1647, 77.5762, 'PALACE', 15.00, 'INR', false, '07:00 - 16:00', 'Mon-Sun', 4.3, 6800, false, true, 1, 'Morning hours', true, true),
(28, 'Pangong Lake', 'High-altitude lake with changing colors', 27, 'Pangong Tso, Ladakh', 33.7500, 78.9500, 'LAKE', 20.00, 'INR', false, '24 hours', 'Mon-Sun', 4.8, 8900, false, true, 4, 'Sunrise and sunset', true, true),
(29, 'Nubra Valley', 'Cold desert with sand dunes and double-humped camels', 27, 'Nubra Valley, Ladakh', 34.5794, 77.6025, 'VIEWPOINT', 50.00, 'INR', false, '24 hours', 'Mon-Sun', 4.7, 5600, false, true, 6, 'Clear weather days', true, false),
(30, 'Shimla Mall Road', 'Colonial-era pedestrian shopping street', 28, 'The Mall, Shimla', 31.1048, 77.1734, 'STREET', 0.00, 'INR', true, '24 hours', 'Mon-Sun', 4.2, 16700, true, true, 2, 'Evening hours', true, false),
(31, 'Rohtang Pass', 'High mountain pass with snow activities', 28, 'Manali-Leh Highway', 32.3493, 77.2519, 'MOUNTAIN', 50.00, 'INR', false, '09:00 - 17:00', 'Mon-Sun', 4.5, 12300, false, true, 4, 'Clear weather', true, true),

-- Neighboring Countries Attractions  
(32, 'Faisal Mosque', 'Modern mosque and architectural marvel in Islamabad', 35, 'Islamabad, Pakistan', 33.7295, 73.0370, 'TEMPLE', 0.00, 'PKR', true, '24 hours', 'Mon-Sun', 4.4, 8900, true, true, 1, 'Sunset hours', true, true),
(33, 'Badshahi Mosque', 'Mughal-era mosque and architectural masterpiece', 36, 'Fort Road, Lahore', 31.5881, 74.3142, 'TEMPLE', 0.00, 'PKR', true, '05:00 - 21:00', 'Mon-Sun', 4.5, 12400, true, true, 1, 'Morning and evening', true, true),
(34, 'Clifton Beach', 'Popular beach and recreational area in Karachi', 37, 'Clifton, Karachi', 24.8134, 67.0269, 'BEACH', 0.00, 'PKR', true, '24 hours', 'Mon-Sun', 4.1, 9800, true, true, 2, 'Sunset hours', true, false),
(35, 'Temple of the Tooth', 'Sacred Buddhist temple housing tooth relic of Buddha', 38, 'Sri Dalada Veediya, Kandy', 7.2955, 80.6402, 'TEMPLE', 1500.00, 'LKR', false, '05:30 - 20:00', 'Mon-Sun', 4.6, 15600, true, true, 2, 'Morning puja', true, true),
(36, 'Galle Fort', 'Dutch colonial fort and UNESCO World Heritage Site', 39, 'Galle Fort, Galle', 6.0266, 80.2170, 'CASTLE', 500.00, 'LKR', false, '24 hours', 'Mon-Sun', 4.5, 11200, true, true, 3, 'Sunset hours', true, true),
(37, 'Horton Plains', 'National park with Worlds End cliff viewpoint', 40, 'Horton Plains, Nuwara Eliya', 6.8067, 80.8206, 'PARK', 3000.00, 'LKR', false, '06:00 - 18:00', 'Mon-Sun', 4.7, 7800, false, true, 4, 'Early morning', true, true),
(38, 'Phewa Lake', 'Scenic lake with boating and mountain reflections', 41, 'Lakeside, Pokhara', 28.2092, 83.9591, 'LAKE', 100.00, 'NPR', false, '06:00 - 18:00', 'Mon-Sun', 4.5, 12300, true, true, 2, 'Morning and sunset', true, false),
(39, 'Sheikh Zayed Grand Mosque', 'Stunning white marble mosque with Islamic architecture', 43, 'Sheikh Rashid Bin Saeed Street, Abu Dhabi', 24.4129, 54.4753, 'TEMPLE', 0.00, 'AED', true, '09:00 - 22:00', 'Sat-Thu', 4.8, 18700, true, true, 2, 'Evening hours', true, true),
(40, 'Louvre Abu Dhabi', 'Universal museum with art from ancient to contemporary', 43, 'Saadiyat Island, Abu Dhabi', 24.5336, 54.3974, 'MUSEUM', 63.00, 'AED', false, '10:00 - 20:00', 'Tue-Sun', 4.6, 8900, true, true, 3, 'Morning hours', true, true);

-- Insert attraction interests
INSERT INTO attraction_interests (attraction_id, interest) VALUES
(1, 'CULTURE'), (1, 'HISTORY'), (1, 'ROMANTIC'),
(2, 'ART'), (2, 'CULTURE'), (2, 'HISTORY'),
(3, 'CULTURE'), (3, 'HISTORY'), (3, 'WELLNESS'),
(4, 'ADVENTURE'), (4, 'CULTURE'),
(5, 'NATURE'), (5, 'FAMILY'), (5, 'SPORTS'),
(6, 'HISTORY'), (6, 'CULTURE'),
(7, 'CULTURE'), (7, 'HISTORY'), (7, 'ART'),
(8, 'HISTORY'), (8, 'CULTURE'),

-- Indian Attraction Interests
(9, 'HISTORY'), (9, 'CULTURE'), (9, 'ROMANTIC'),
(10, 'HISTORY'), (10, 'CULTURE'), (10, 'ART'),
(11, 'ROMANTIC'), (11, 'CULTURE'), (11, 'NIGHTLIFE'),
(12, 'HISTORY'), (12, 'CULTURE'), (12, 'ART'),
(13, 'HISTORY'), (13, 'CULTURE'), (13, 'FAMILY'),
(14, 'HISTORY'), (14, 'CULTURE'), (14, 'ART'),
(15, 'HISTORY'), (15, 'CULTURE'), (15, 'ART'),
(16, 'NATURE'), (16, 'ADVENTURE'), (16, 'FAMILY'),
(17, 'BEACH'), (17, 'ADVENTURE'), (17, 'NIGHTLIFE'),
(18, 'NATURE'), (18, 'ROMANTIC'), (18, 'WELLNESS'),
(19, 'NATURE'), (19, 'ROMANTIC'), (19, 'ADVENTURE'),
(20, 'CULTURE'), (20, 'HISTORY'), (20, 'ROMANTIC'),
(21, 'HISTORY'), (21, 'CULTURE'), (21, 'ART'),
(22, 'HISTORY'), (22, 'CULTURE'), (22, 'ART'),
(23, 'HISTORY'), (23, 'CULTURE'), (23, 'ADVENTURE'),
(24, 'NATURE'), (24, 'ROMANTIC'), (24, 'CULTURE'),
(25, 'NATURE'), (25, 'CULTURE'), (25, 'ROMANTIC'),
(26, 'NATURE'), (26, 'ADVENTURE'), (26, 'ROMANTIC'),
(27, 'HISTORY'), (27, 'CULTURE'), (27, 'ART'),
(28, 'NATURE'), (28, 'ADVENTURE'), (28, 'ROMANTIC'),
(29, 'NATURE'), (29, 'ADVENTURE'), (29, 'CULTURE'),
(30, 'CULTURE'), (30, 'SHOPPING'), (30, 'FAMILY'),
(31, 'NATURE'), (31, 'ADVENTURE'), (31, 'FAMILY'),

-- Neighboring Countries Attraction Interests
(32, 'CULTURE'), (32, 'HISTORY'), (32, 'ART'),
(33, 'CULTURE'), (33, 'HISTORY'), (33, 'ART'),
(34, 'BEACH'), (34, 'FAMILY'), (34, 'ROMANTIC'),
(35, 'CULTURE'), (35, 'HISTORY'), (35, 'WELLNESS'),
(36, 'HISTORY'), (36, 'CULTURE'), (36, 'ART'),
(37, 'NATURE'), (37, 'ADVENTURE'), (37, 'FAMILY'),
(38, 'NATURE'), (38, 'ROMANTIC'), (38, 'ADVENTURE'),
(39, 'CULTURE'), (39, 'ART'), (39, 'HISTORY'),
(40, 'CULTURE'), (40, 'ART'), (40, 'HISTORY');

-- Insert attraction images with high-quality Unsplash URLs
INSERT INTO attraction_images (attraction_id, image_url) VALUES
(1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/330px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'), -- Eiffel Tower
(2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/330px-Louvre_Museum_Wikimedia_Commons.jpg'), -- Louvre
(3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Sensoji_2023.jpg/330px-Sensoji_2023.jpg'), -- Sensō-ji
(4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tokyo_Skytree_2014_%E2%85%A2.jpg/330px-Tokyo_Skytree_2014_%E2%85%A2.jpg'), -- Tokyo Skytree
(5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/330px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg'), -- Central Park
(6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/330px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg'), -- Statue of Liberty
(7, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/British_Museum_%28aerial%29.jpg/330px-British_Museum_%28aerial%29.jpg'), -- British Museum
(8, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Tower_of_London_from_the_Shard_%288515883950%29.jpg/330px-Tower_of_London_from_the_Shard_%288515883950%29.jpg'), -- Tower of London
(9, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/330px-Mumbai_03-2016_30_Gateway_of_India.jpg'), -- Gateway of India
(10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elephanta_Caves_Trimurti.jpg/330px-Elephanta_Caves_Trimurti.jpg'), -- Elephanta Caves
(11, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg/330px-Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg'), -- Marine Drive, Mumbai
(12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/330px-Delhi_fort.jpg'), -- Red Fort
(13, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/330px-India_Gate_in_New_Delhi_03-2016.jpg'), -- India Gate
(14, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/330px-Qutb_Minar_2022.jpg'), -- Qutb Minar
(15, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/330px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg'), -- Basilica of Bom Jesus
(16, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Doodhsagar_Fall.jpg/330px-Doodhsagar_Fall.jpg'), -- Dudhsagar Falls
(17, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Baga_Beach%2C_Calangute%2C_Goa.jpg/330px-Baga_Beach%2C_Calangute%2C_Goa.jpg'), -- Baga, Goa
(18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/330px-House_Boat_DSW.jpg'), -- Kerala backwaters
(19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/330px-Munnar_Overview.jpg'), -- Munnar
(20, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg/330px-Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg'), -- Chinese fishing nets
(21, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/330px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg'), -- Hawa Mahal
(22, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg/330px-Chandra_Mahal%2C_City_Palace%2C_Jaipur%2C_20191218_0951_9043.jpg'), -- City Palace, Jaipur
(23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/330px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg'), -- Amber Fort
(24, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Dal_Lake_Hazratbal_Srinagar.jpg/330px-Dal_Lake_Hazratbal_Srinagar.jpg'), -- Dal Lake
(25, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Shalimar_Bagh_1.jpg/330px-Shalimar_Bagh_1.jpg'), -- Shalimar Bagh, Srinagar
(26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ancient_Temple%2C_Gulmarg.jpg/330px-Ancient_Temple%2C_Gulmarg.jpg'), -- Gulmarg
(27, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Leh_Palace_2011.jpg/330px-Leh_Palace_2011.jpg'), -- Leh Palace
(28, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/ISS054-E-7809_-_View_of_Earth_%28cropped%29.jpg/330px-ISS054-E-7809_-_View_of_Earth_%28cropped%29.jpg'), -- Pangong Tso
(29, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/5_Nubra_valley.jpg/330px-5_Nubra_valley.jpg'), -- Nubra Valley
(30, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg/330px-Landscape_of_Shimla_%2C_Himachal_Pradesh.jpg'), -- Shimla
(31, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kullu_Valley_from_Rohtang_Pass%2C_India.jpg/330px-Kullu_Valley_from_Rohtang_Pass%2C_India.jpg'), -- Rohtang Pass
(32, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg/330px-Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg'), -- Faisal Mosque
(33, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Badshahi_Mosque_front_picture.jpg/330px-Badshahi_Mosque_front_picture.jpg'), -- Badshahi Mosque
(34, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/PK_Karachi_asv2020-02_img06_Bagh_Ibne_Qasim.jpg/330px-PK_Karachi_asv2020-02_img06_Bagh_Ibne_Qasim.jpg'), -- Clifton, Karachi
(35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg/330px-SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg'), -- Temple of the Tooth
(36, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Galle_Fort.jpg/330px-Galle_Fort.jpg'), -- Galle Fort
(37, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Srilankamountainforest.jpg/330px-Srilankamountainforest.jpg'), -- Horton Plains National Park
(38, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phewa_lake%2C_Pokhara.jpg/330px-Phewa_lake%2C_Pokhara.jpg'), -- Phewa Lake
(39, 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Sheikh_Zayed_Mosque_view.jpg/330px-Sheikh_Zayed_Mosque_view.jpg'), -- Sheikh Zayed Grand Mosque
(40, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/LouvreAD_exterior.jpg/330px-LouvreAD_exterior.jpg'); -- Louvre Abu Dhabi

-- Insert sample users
INSERT INTO users (id, email, password, first_name, last_name, phone_number, role, enabled, verified, preferred_currency, created_at, updated_at) VALUES
(1, 'steve@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Steve', 'User', '8210897903', 'USER', true, true, 'INR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'john.doe@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Doe', '9876543210', 'USER', true, true, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'sarah.wilson@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Sarah', 'Wilson', '8765432109', 'USER', true, true, 'EUR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'admin@roamy.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Admin', 'User', '7654321098', 'ADMIN', true, true, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);