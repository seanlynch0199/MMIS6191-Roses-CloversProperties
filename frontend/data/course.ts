import { CourseInfo } from './types'

export const homeCoursInfo: CourseInfo = {
  name: 'Timberwolf Trail Course',
  distance: '5K (3.1 miles)',
  terrain: 'Mixed grass, gravel trails, and wooded sections',
  description: 'The Timberwolf Trail Course winds through the beautiful forests behind Pine Ridge High School. The course features rolling hills, shaded woodland paths, and a thrilling downhill finish into the stadium. Runners experience a variety of terrain including maintained grass fields, crushed gravel trails, and natural dirt paths through the trees.',
  mapImageUrl: '/course-map-placeholder.png',
  mapLink: 'https://onthegomap.com/s/placeholder',
  tips: [
    {
      title: 'Start Smart',
      content: 'The first 400m is slightly uphill on grass. Resist the urge to go out too fast. Find your rhythm and settle in before the first turn into the woods.',
    },
    {
      title: 'The Ridge Section (Mile 1-2)',
      content: 'This is the hilliest part of the course with three moderate climbs. Keep your effort steady on the uphills and recover on the downhills. Many runners lose position here by going too hard too early.',
    },
    {
      title: 'The Back Loop (Mile 2-2.5)',
      content: 'A relatively flat section through open meadow. This is your chance to make moves or recover. Watch footing near the creek crossing - it can be muddy after rain.',
    },
    {
      title: 'The Finishing Stretch',
      content: 'The final 800m features a gradual downhill into the stadium. This is where strong finishers thrive. Pick up your cadence and drive to the line. The crowd will carry you home!',
    },
    {
      title: 'Shoe Selection',
      content: 'Cross country spikes with 1/4" or 3/8" pins work well. Flats are fine for most conditions but spikes give an advantage on wet grass and the wooded sections.',
    },
  ],
  spectatorSpots: [
    {
      name: 'Stadium Start/Finish',
      description: 'The best spot to see runners at the start and finish. Bleacher seating available. Arrive early for good spots during big meets.',
      accessibility: 'Fully accessible, paved paths',
    },
    {
      name: 'Ridge Overlook (1 Mile Mark)',
      description: 'A great vantage point to see runners climbing the main hill. About a 5-minute walk from the stadium via the service road.',
      accessibility: 'Gravel path, moderate incline',
    },
    {
      name: 'Meadow Crossing (2 Mile Mark)',
      description: 'Open field area where you can see runners coming through the back loop. Easy walk from the parking lot via the nature trail.',
      accessibility: 'Grass field, may be soft when wet',
    },
    {
      name: 'Woods Exit',
      description: 'See runners emerging from the final wooded section before the finishing kick. Good photo opportunity.',
      accessibility: 'Short grass walk from stadium',
    },
  ],
  parking: 'Free parking is available in the main school lot (Lot A) and overflow lot (Lot B). For large meets, additional parking is available at the church across the street with shuttle service. Handicap parking is located closest to the stadium entrance.',
  restrooms: 'Permanent restrooms are located in the stadium building, open during all meets. Portable restrooms are placed near the 1-mile mark and at the meadow crossing for large invitational meets.',
  facilities: [
    'Covered team tents area with numbered spots',
    'Concession stand (operated by Booster Club)',
    'Athletic training station with medical personnel',
    'Electronic timing and live results display',
    'PA system for announcements',
    'Awards stage near finish line',
  ],
}

export const middleSchoolCourseInfo: CourseInfo = {
  name: 'Timberwolf Trail - Middle School Course',
  distance: '2 Miles',
  terrain: 'Grass fields and gentle trails',
  description: 'The middle school course uses a modified version of the main course, staying on the lower, flatter sections. Perfect for developing runners, the course avoids the steeper hills while still providing a challenging and fun racing experience.',
  tips: [
    {
      title: 'Pace Yourself',
      content: 'Two miles goes by fast! Start controlled and build through the race. Save energy for a strong finish.',
    },
    {
      title: 'Stay on Course',
      content: 'Follow the orange cones and course marshals. The MS course splits from the HS course at the 800m mark.',
    },
  ],
  spectatorSpots: [
    {
      name: 'Stadium Start/Finish',
      description: 'See the start and finish in one location.',
      accessibility: 'Fully accessible',
    },
    {
      name: 'Field Loop',
      description: 'The MS course loops through the practice fields, visible from the stadium.',
      accessibility: 'Flat grass area',
    },
  ],
  parking: 'Same as varsity meets - use Lots A and B.',
  restrooms: 'Stadium restrooms available.',
  facilities: [
    'Covered team area',
    'Concession stand',
    'First aid station',
  ],
}
