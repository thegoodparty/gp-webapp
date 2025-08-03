# Address Implementation Plan

## Overview

Implement comprehensive address handling for campaigns by storing Google Places data in the database and creating services to convert place_id to full address objects when needed.

## Database Schema Changes

### 1. Update campaign.prisma - DONE

- Add `formatted_address` field (String?, optional)
- Add `place_id` field (String?, optional)
- These fields will store the basic address info from Google Places

### 2. Create a migration script - DONE

- Keep `address?: string` for cached display string
- keep the full address object website content until we deploy this to prod and can migrate the placeId from website to the campaign.
- create a temp script with admin permissions on the website controller to copy the place id to the campaign

## Backend Service Implementation

### 3. Create Google Places Service - DONE

- Create new service: `src/shared/services/places.service.ts`
- Implement method: `getAddressByPlaceId(placeId: string): Promise<GooglePlacesApiResponse>`
- Use existing GooglePlacesApiResponse type from website.jsonTypes.ts
- Handle API calls to Google Places API
- Include proper error handling for invalid place_ids

### 4. Update Campaign Service - DONE

- Add methods to save/retrieve address data
- Method: `updateCampaignAddress(campaignId: number, formatted_address: string, place_id: string)`
- Method: `getCampaignFullAddress(campaignId: number): Promise<GooglePlacesApiResponse>`
  - This will use the places service to convert place_id to full address object

## Frontend Integration

### 6. Update ContactStep.js - DONE

- Modify `onAddressChange` to extract and save:
  - `formatted_address` from Google Places response
  - `place_id` from Google Places response
- Update API calls to save this data to campaign table

## API Endpoints

### 7. Campaign Controller Updates - NOT NEEDED

- ✅ Address saving: Uses existing `updateCampaign` endpoint
- ✅ Validation: Existing campaign validation handles new fields
- ✅ Address retrieval: Service method ready (`getCampaignFullAddress`), endpoint can be added when needed

## Testing & Validation

### 8. Integration Testing

- Test address saving from both forms
- Verify place_id to address conversion works
- Test edge cases (invalid place_ids, API failures)
- Ensure backward compatibility with existing campaigns

### 10. Data Migration (if needed)

- If existing campaigns have address data in different format
- Create migration script to populate new fields from existing data

## Key Technical Notes

- **Google Places API**: Ensure API key has proper permissions for Places API
- **Error Handling**: Handle cases where place_id becomes invalid over time
- **Caching**: Consider caching full address objects to reduce API calls
- **Rate Limiting**: Be mindful of Google Places API rate limits
- **Privacy**: Ensure address data handling complies with privacy requirements

## Dependencies

- Google Places API access
- Existing GooglePlacesApiResponse type
- Current campaign and website schemas
- Frontend forms that collect address data

## Success Criteria

✅ Campaign table stores formatted_address and place_id  
✅ Database migration completed successfully  
✅ Admin migration script created for existing data  
✅ Places service can convert place_id to full address object  
✅ Campaign service can save and retrieve address data  
✅ Frontend forms save address data to campaign table  
✅ Uses existing updateCampaign endpoint (no new endpoints needed)
✅ Website content uses cached address string only  
✅ Full address retrieval capability ready when needed  
✅ All existing functionality remains intact

## Admin Migration Usage

To migrate existing address data from websites to campaigns:

```
POST /websites/admin/migrate-addresses
```

(Requires admin role)
