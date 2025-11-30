# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# ============================================
# Node stage - Build Angular frontend
# ============================================
FROM node:20-alpine AS angular-build

WORKDIR /src/FrontEnd

# Copy package files for dependency caching
COPY ["FrontEnd/package.json", "FrontEnd/package-lock.json*", "./"]

# Install dependencies (cached layer)
RUN npm ci && npm cache clean --force

# Copy and build Angular app
COPY FrontEnd/ ./
RUN npm run build -- --configuration production

# ============================================
# This stage is used when running from VS in fast mode (Default for Debug configuration)
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# ============================================
# This stage is used to build the service project
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj and restore dependencies (cached layer)
COPY ["Backend.csproj", "."]
RUN dotnet restore "./Backend.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# ============================================
# This stage is used to publish the service project to be copied to the final stage
# ============================================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# ============================================
# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
# ============================================
FROM base AS final
WORKDIR /app

# Copy published backend
COPY --from=publish /app/publish .

# Copy built Angular frontend to wwwroot
COPY --from=angular-build /src/FrontEnd/dist/browser ./wwwroot

ENTRYPOINT ["dotnet", "Backend.dll"]
