"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Moon,
  Sun,
  Check,
  ChevronRight,
} from "lucide-react";

const settingsSections = [
  {
    id: "account",
    title: "Account",
    description: "Manage your account details and preferences",
    icon: User,
    items: [
      { label: "Email", value: "john@example.com", type: "text" },
      { label: "Name", value: "John Smith", type: "text" },
      { label: "Company", value: "Smith HVAC Services", type: "text" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure how you receive updates",
    icon: Bell,
    items: [
      { label: "Email notifications", value: true, type: "toggle" },
      { label: "Weekly reports", value: true, type: "toggle" },
      { label: "AI insight alerts", value: false, type: "toggle" },
      { label: "Review notifications", value: true, type: "toggle" },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize the look and feel",
    icon: Palette,
    items: [{ label: "Theme", value: "dark", type: "theme" }],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettings] = useState(settingsSections);

  const toggleSetting = (sectionId: string, itemLabel: string) => {
    setSettings((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.label === itemLabel ? { ...item, value: !item.value } : item
              ),
            }
          : section
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settings.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                  <ChevronRight
                    className={`ml-auto h-4 w-4 transition-transform ${
                      activeSection === section.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
              );
            })}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Shield className="h-4 w-4" />
              Security
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <CreditCard className="h-4 w-4" />
              Billing
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {settings.map((section) => (
            <div
              key={section.id}
              className={activeSection === section.id ? "block" : "hidden"}
            >
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="font-semibold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="divide-y divide-border">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        {item.type === "text" && (
                          <p className="text-sm text-muted-foreground">{item.value as string}</p>
                        )}
                      </div>
                      {item.type === "toggle" && (
                        <button
                          onClick={() => toggleSetting(section.id, item.label)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            item.value ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                              item.value ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      )}
                      {item.type === "text" && (
                        <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                          Edit
                        </button>
                      )}
                      {item.type === "theme" && (
                        <div className="flex items-center gap-2">
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:text-foreground">
                            <Sun className="h-4 w-4" />
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary">
                            <Moon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
