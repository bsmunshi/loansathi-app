# Adding LinkedIn Profile Photo

## How to Add Your LinkedIn Photo to About Me Page

### Option 1: Manual Download (Recommended)
1. Go to your LinkedIn profile: https://linkedin.com/in/bhushanmunshi
2. Right-click on your profile photo
3. Select "Save image as..."
4. Save as `bhushan-profile.jpg` in `src/assets/` folder
5. Update the AboutMe component:

```jsx
// Replace the placeholder div with:
<img
  src="/src/assets/bhushan-profile.jpg"
  alt="Bhushan Munshi"
  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
/>
```

### Option 2: Use Public LinkedIn Photo URL
If your LinkedIn photo is public, you can use the direct URL:

```jsx
<img
  src="https://media.licdn.com/dms/image/your-photo-id/profile-displayphoto-shrink_400_400/0/your-timestamp?e=your-expiry&v=beta&t=your-token"
  alt="Bhushan Munshi"
  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
  onError={(e) => {
    // Fallback to initials if image fails to load
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  }}
/>
```

### Option 3: Use Gravatar
If you have a Gravatar account:

```jsx
<img
  src={`https://www.gravatar.com/avatar/${md5(email)}?s=160&d=identicon`}
  alt="Bhushan Munshi"
  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
/>
```

### Current Implementation
The current implementation shows initials "BM" as a fallback with a note to connect on LinkedIn for the latest photo. This is professional and works well until you add your actual photo.
