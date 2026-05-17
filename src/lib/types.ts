export interface Property {
  id: number
  created_at: string
  user_id: number
  name: string
  phone: string
  province: string
  city: string
  village: string
  property_type: string
  description: string
  capacity: string
  rooms: string
  area: string
  price_from: string
  price_to: string
  amenities: string
  media: string
  status: 'pending' | 'approved' | 'rejected'
}
