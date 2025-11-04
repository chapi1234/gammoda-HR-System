import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Calendar as CalendarIcon, Plus, Clock, MapPin, Users, 
  ChevronLeft, ChevronRight, Filter, Search, X 
} from 'lucide-react';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

const Calendar = () => {

    const wrapperStyle = {
    paddingBottom: "20px",
    marginTop: "20px"
  };

  const statCardsContainerStyle = {    
    alignItems: "stretch",
  };

  const marginStyle = {
    marginBottom: "10px"
  };

  const button = {
    width: "200px"
  };

  const { user, isHR } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    type: 'meeting',
    location: '',
    attendees: []
  });

  // Events from API
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const toYMD = (d) => {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const monthRange = useMemo(() => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return { from: toYMD(start), to: toYMD(end) };
  }, [selectedDate]);

  const transformEvent = (e) => ({
    id: e._id || e.id,
    title: e.title,
    description: e.description || '',
    date: toYMD(e.date),
    time: e.time || '09:00',
    duration: e.duration,
    type: e.type,
    location: e.location || '',
    attendees: Array.isArray(e.attendees) ? e.attendees : [],
    color: e.color || 'bg-gray-500',
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        from: monthRange.from,
        to: monthRange.to,
      };
      if (filterType !== 'all') params.type = filterType;
      if (searchTerm && searchTerm.trim().length > 0) params.q = searchTerm.trim();

      const res = await axios.get(`${API_BASE}/api/events`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.data || [];
      setEvents(list.map(transformEvent));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
    { value: 'holiday', label: 'Holiday', color: 'bg-red-500' },
    { value: 'training', label: 'Training', color: 'bg-purple-500' },
    { value: 'personal', label: 'Personal', color: 'bg-green-500' },
    { value: 'other', label: 'Other', color: 'bg-gray-500' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...newEvent,
        duration: newEvent.duration ? Number(newEvent.duration) : undefined,
        date: newEvent.date, // already YYYY-MM-DD
      };

      const res = await axios.post(`${API_BASE}/api/events`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const created = res.data?.data;
      if (!created) throw new Error('No event returned');

      setEvents((prev) => [...prev, transformEvent(created)]);
      setNewEvent({
        title: '', description: '', date: new Date().toISOString().split('T')[0],
        time: '09:00', duration: '60', type: 'meeting', location: '', attendees: []
      });
      setShowEventDialog(false);
      toast.success('Event added successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add event');
    }
  };

  // Fetch events when month, filter, or search changes
  useEffect(() => {
    if (!token) return; // must be authenticated
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthRange.from, monthRange.to, filterType, searchTerm]);

  const formatTime = (time) => {
    if (time === 'all-day') return 'All Day';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventBadgeVariant = (type) => {
    const variants = {
      meeting: 'default',
      holiday: 'destructive',
      training: 'secondary',
      personal: 'outline'
    };
    return variants[type] || 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div style={marginStyle}>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">
            {isHR ? 'Manage company events and schedules' : 'View your schedule and company events'}
          </p>
        </div>
        {isHR && (
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild style={{ ...marginStyle, ...button}}>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new calendar event</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Event description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Meeting room, Zoom link, etc."
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent} className="btn-gradient">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Calendar Controls */}
      <Card style={marginStyle} className="dashboard-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="relative flex-1 min-w-full sm:min-w-[250px] md:min-w-[300px] lg:min-w-[240px]">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"  />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 min-w-full sm:min-w-[250px] md:min-w-[220px] lg:min-w-[180px]">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-full sm:min-w-[250px] md:min-w-[220px] lg:min-w-[180px]">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div style={marginStyle} className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersClassNames={{
                  hasEvents: "bg-primary/10 font-semibold"
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar */}
        <div style={marginStyle} className="space-y-6">
          {/* Selected Date Events */}
          <Card style={marginStyle} className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">
                Events for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground text-sm text-center py-4">Loading events…</p>
                ) : getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(event.time)}
                          {event.duration && event.time !== 'all-day' && (
                            <span> ({event.duration} min)</span>
                          )}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees.length > 0 && (
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No events scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(loading ? [] : filteredEvents)
                  .filter(event => new Date(event.date) >= new Date())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(event.time)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;