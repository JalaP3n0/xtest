"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, ChangeEvent } from "react";
import { Header } from "@/components/Header";

type Language = {
  language: string;
  level: string;
};

type Profile = {
  id: string;
  name: string;
  nickname: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  createdAt: string;
  usher?: {
    bio: string;
    experience: string;
    profilePhoto: string;
    languages: Language[];
  };
  clientProfile?: {
    companyName: string;
    jobTitle: string;
    industry: string;
    website: string;
    bio: string;
  };
};

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="app-shell"><Header /><div className="panel"><p className="empty-state">Loading profile...</p></div></main>}>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGender, setEditGender] = useState("");

  // Usher states
  const [editBio, setEditBio] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editLanguages, setEditLanguages] = useState<Language[]>([]);

  // Client states
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editClientBio, setEditClientBio] = useState("");

  useEffect(() => {
    loadProfile();
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [router, searchParams]);

  async function loadProfile() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("ushereel_token");
    if (!token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to load profile");
      
      setProfile(data);
      setEditNickname(data.nickname || "");
      setEditPhone(data.phone || "");
      setEditGender(data.gender || "");

      if (data.role === "USHER") {
        setEditBio(data.usher?.bio || "");
        setEditExperience(data.usher?.experience || "");
        setEditPhoto(data.usher?.profilePhoto || "");
        setEditLanguages(data.usher?.languages || []);
      }

      if (data.role === "CLIENT") {
        setEditCompanyName(data.clientProfile?.companyName || "");
        setEditJobTitle(data.clientProfile?.jobTitle || "");
        setEditIndustry(data.clientProfile?.industry || "");
        setEditWebsite(data.clientProfile?.website || "");
        setEditClientBio(data.clientProfile?.bio || "");
      }

      if (data?.role === "ADMIN") {
        router.replace("/admin");
        return;
      }
    } catch (err) {
      localStorage.removeItem("ushereel_token");
      setError(err instanceof Error ? err.message : "Failed to load profile");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("ushereel_token");
    const role = profile?.role;
    const endpoint = role === "USHER" ? "/api/ushers/profile" : "/api/clients/profile";
    
    const body = role === "USHER" ? {
      bio: editBio,
      experience: editExperience,
      nickname: editNickname,
      phone: editPhone,
      gender: editGender,
      profilePhoto: editPhoto,
      languages: editLanguages
    } : {
      companyName: editCompanyName,
      jobTitle: editJobTitle,
      industry: editIndustry,
      website: editWebsite,
      bio: editClientBio,
      nickname: editNickname,
      phone: editPhone,
      gender: editGender
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to save profile");
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const token = localStorage.getItem("ushereel_token");
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/users/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to upload photo");
      
      setEditPhoto(data.photoUrl);
      setSuccess("Photo uploaded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  function addLanguage() {
    setEditLanguages([...editLanguages, { language: "", level: "Beginner" }]);
  }

  function updateLanguage(index: number, field: keyof Language, value: string) {
    const updated = [...editLanguages];
    updated[index][field] = value;
    setEditLanguages(updated);
  }

  function removeLanguage(index: number) {
    setEditLanguages(editLanguages.filter((_, i) => i !== index));
  }

  function logout() {
    localStorage.removeItem("ushereel_token");
    router.replace("/login");
  }

  if (loading) return (
    <main className="app-shell">
      <Header />
      <div className="panel"><p className="empty-state">Loading profile...</p></div>
    </main>
  );

  return (
    <main className="app-shell">
      <Header />

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <p className="eyebrow">{profile?.role} Profile</p>
            <h1 className="page-title compact">{profile?.name}</h1>
            {profile?.role === "CLIENT" && profile.clientProfile && (
              <p className="lede" style={{ marginTop: 4 }}>{profile.clientProfile.jobTitle} at {profile.clientProfile.companyName}</p>
            )}
          </div>
          <div className="button-row">
            {!isEditing ? (
              <button className="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <>
                <button className="button secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="button" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              </>
            )}
            <button className="button secondary" onClick={logout}>Logout</button>
          </div>
        </div>

        {error && <p className="error-box">{error}</p>}
        {success && <p className="status-pill" style={{ color: "var(--success)", borderColor: "var(--success)", background: "transparent", display: "block", marginBottom: 16 }}>{success}</p>}

        <div className="account-grid">
          <div className="profile-item">
            <div className="profile-label">Email</div>
            <div className="profile-value">{profile?.email}</div>
          </div>
          
          <div className="profile-item">
            <div className="profile-label">Phone</div>
            {!isEditing ? (
              <div className="profile-value">{profile?.phone || "-"}</div>
            ) : (
              <input className="field" style={{ marginTop: 8, width: '100%' }} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" />
            )}
          </div>

          {profile?.role === "USHER" && (
            <>
              <div className="profile-item">
                <div className="profile-label">Gender</div>
                {!isEditing ? (
                  <div className="profile-value">{profile?.gender || "-"}</div>
                ) : (
                  <select style={{ marginTop: 8, width: '100%', height: 42, padding: '0 12px', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }} value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>

              <div className="profile-item">
                <div className="profile-label">Nickname</div>
                {!isEditing ? (
                  <div className="profile-value">{profile?.nickname || "-"}</div>
                ) : (
                  <input className="field" style={{ marginTop: 8, width: '100%' }} value={editNickname} onChange={(e) => setEditNickname(e.target.value)} placeholder="Nickname" />
                )}
              </div>
            </>
          )}
        </div>

        {profile?.role === "CLIENT" && (
          <div style={{ marginTop: 40 }}>
            <h2 className="section-title">Company Information</h2>
            
            <div className="account-grid">
              <div className="profile-item">
                <div className="profile-label">Company Name</div>
                {!isEditing ? (
                  <div className="profile-value">{profile.clientProfile?.companyName}</div>
                ) : (
                  <input className="field" style={{ marginTop: 8, width: '100%' }} value={editCompanyName} onChange={(e) => setEditCompanyName(e.target.value)} />
                )}
              </div>
              <div className="profile-item">
                <div className="profile-label">Job Title</div>
                {!isEditing ? (
                  <div className="profile-value">{profile.clientProfile?.jobTitle}</div>
                ) : (
                  <input className="field" style={{ marginTop: 8, width: '100%' }} value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} />
                )}
              </div>
              <div className="profile-item">
                <div className="profile-label">Industry</div>
                {!isEditing ? (
                  <div className="profile-value">{profile.clientProfile?.industry || "-"}</div>
                ) : (
                  <input className="field" style={{ marginTop: 8, width: '100%' }} value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} />
                )}
              </div>
              <div className="profile-item">
                <div className="profile-label">Website</div>
                {!isEditing ? (
                  <div className="profile-value">{profile.clientProfile?.website || "-"}</div>
                ) : (
                  <input className="field" style={{ marginTop: 8, width: '100%' }} value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} />
                )}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div className="profile-label">Company Bio / Description</div>
              {!isEditing ? (
                <p className="supporting-copy" style={{ marginTop: 8 }}>{profile.clientProfile?.bio || "No description added."}</p>
              ) : (
                <textarea 
                  style={{ marginTop: 8, width: '100%', minHeight: 100, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius)', font: 'inherit' }} 
                  value={editClientBio} 
                  onChange={(e) => setEditClientBio(e.target.value)} 
                  placeholder="Describe your company's core business and event needs..."
                />
              )}
            </div>
          </div>
        )}

        {profile?.role === "USHER" && (
          <div style={{ marginTop: 40 }}>
            <h2 className="section-title">Usher Details</h2>
            
            <div style={{ marginTop: 24 }}>
              <div className="profile-label">Profile Photo</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative', width: 100, height: 100 }}>
                  {editPhoto || profile.usher?.profilePhoto ? (
                    <img 
                      src={editPhoto || profile.usher?.profilePhoto || ""} 
                      alt="Profile" 
                      style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--line)' }} 
                    />
                  ) : (
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-subtle)', border: '2px dashed var(--line)', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
                      No Photo
                    </div>
                  )}
                  {isEditing && (
                    <label 
                      style={{ 
                        position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, 
                        background: 'var(--accent)', borderRadius: '50%', cursor: 'pointer',
                        display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-sm)', border: '2px solid var(--panel)'
                      }}
                    >
                      <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span>
                    </label>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{uploading ? "Uploading..." : "Click the + to upload a new photo"}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--muted)' }}>JPG, PNG or WEBP. Max 5MB.</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div className="profile-label">Bio</div>
              {!isEditing ? (
                <p className="supporting-copy" style={{ marginTop: 8 }}>{profile.usher?.bio || "No bio added."}</p>
              ) : (
                <textarea 
                  style={{ marginTop: 8, width: '100%', minHeight: 100, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius)', font: 'inherit' }} 
                  value={editBio} 
                  onChange={(e) => setEditBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                />
              )}
            </div>

            <div style={{ marginTop: 24 }}>
              <div className="profile-label">Experience</div>
              {!isEditing ? (
                <p className="supporting-copy" style={{ marginTop: 8 }}>{profile.usher?.experience || "No experience details added."}</p>
              ) : (
                <textarea 
                  style={{ marginTop: 8, width: '100%', minHeight: 100, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius)', font: 'inherit' }} 
                  value={editExperience} 
                  onChange={(e) => setEditExperience(e.target.value)} 
                  placeholder="Summarize your relevant experience..."
                />
              )}
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="profile-label">Languages</div>
                {isEditing && <button className="button secondary" style={{ padding: '4px 12px', minHeight: 'auto' }} onClick={addLanguage}>+ Add</button>}
              </div>
              
              {!isEditing ? (
                <div className="metric-grid" style={{ marginTop: 16 }}>
                  {(profile.usher?.languages || []).length > 0 ? profile.usher?.languages.map((l, i) => (
                    <div key={i} className="metric-card" style={{ padding: 12 }}>
                      <div className="metric-title" style={{ fontSize: '0.7rem' }}>{l.level}</div>
                      <div className="metric-value" style={{ fontSize: '1.2rem', marginTop: 4 }}>{l.language}</div>
                    </div>
                  )) : <p className="supporting-copy">No languages listed.</p>}
                </div>
              ) : (
                <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                  {editLanguages.map((l, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input className="field" style={{ flex: 2 }} value={l.language} onChange={(e) => updateLanguage(i, 'language', e.target.value)} placeholder="Language (e.g. English)" />
                      <select style={{ flex: 1, height: 42, padding: '0 8px', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }} value={l.level} onChange={(e) => updateLanguage(i, 'level', e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Native">Native</option>
                      </select>
                      <button className="button secondary" style={{ minWidth: 'auto', padding: '0 12px' }} onClick={() => removeLanguage(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
