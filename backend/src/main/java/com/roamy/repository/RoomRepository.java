package com.roamy.repository;

import com.roamy.entity.Room;
import com.roamy.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByHotel(Hotel hotel);
    
    List<Room> findByHotelAndAvailableTrue(Hotel hotel);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.available = true ORDER BY r.basePrice ASC")
    List<Room> findByHotelOrderByPrice(@Param("hotel") Hotel hotel);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.roomType = :roomType AND r.available = true")
    List<Room> findByHotelAndRoomType(@Param("hotel") Hotel hotel, @Param("roomType") Room.RoomType roomType);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.maxOccupancy >= :minOccupancy AND r.available = true")
    List<Room> findByHotelAndMinOccupancy(@Param("hotel") Hotel hotel, @Param("minOccupancy") Integer minOccupancy);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.basePrice BETWEEN :minPrice AND :maxPrice AND r.available = true")
    List<Room> findByHotelAndPriceRange(@Param("hotel") Hotel hotel,
                                        @Param("minPrice") BigDecimal minPrice,
                                        @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT r FROM Room r JOIN r.amenities a WHERE r.hotel = :hotel AND a IN :amenities AND r.available = true")
    List<Room> findByHotelAndAmenities(@Param("hotel") Hotel hotel,
                                       @Param("amenities") List<Room.RoomAmenity> amenities);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.smokingAllowed = :smokingAllowed AND r.available = true")
    List<Room> findByHotelAndSmokingAllowed(@Param("hotel") Hotel hotel, @Param("smokingAllowed") Boolean smokingAllowed);
    
    @Query("SELECT r FROM Room r WHERE r.hotel = :hotel AND r.petFriendly = :petFriendly AND r.available = true")
    List<Room> findByHotelAndPetFriendly(@Param("hotel") Hotel hotel, @Param("petFriendly") Boolean petFriendly);
    
    @Query("SELECT r FROM Room r WHERE r.roomNumber = :roomNumber AND r.hotel = :hotel")
    Room findByRoomNumberAndHotel(@Param("roomNumber") String roomNumber, @Param("hotel") Hotel hotel);
    
    @Query("SELECT MIN(r.basePrice) FROM Room r WHERE r.hotel = :hotel AND r.available = true")
    BigDecimal findMinPriceByHotel(@Param("hotel") Hotel hotel);
    
    @Query("SELECT MAX(r.basePrice) FROM Room r WHERE r.hotel = :hotel AND r.available = true")
    BigDecimal findMaxPriceByHotel(@Param("hotel") Hotel hotel);
    
    @Query("SELECT COUNT(r) FROM Room r WHERE r.hotel = :hotel AND r.available = true")
    long countAvailableRoomsByHotel(@Param("hotel") Hotel hotel);
}