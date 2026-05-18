"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { eventsService } from "@/services/events.service";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    lat: "",
    lng: "",
    requiredUshers: "",
    language: "English",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        requiredUshers: parseInt(formData.requiredUshers, 10),
        date: new Date(formData.date).toISOString(),
      };

      await eventsService.create(payload);
      router.push("/client/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <Header />
      
      <div className="content-container">
        <h1 className="page-title">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="form-stack" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {error && <div className="error-box">{error}</div>}
          
          <div className="form-field">
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="date">Event Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-field">
              <label htmlFor="lat">Latitude</label>
              <input
                type="number"
                step="any"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div className="form-field">
              <label htmlFor="lng">Longitude</label>
              <input
                type="number"
                step="any"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="requiredUshers">Required Ushers</label>
            <input
              type="number"
              id="requiredUshers"
              name="requiredUshers"
              value={formData.requiredUshers}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="language">Preferred Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
