"use client";

import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { getAuthors, addAuthor as apiAddAuthor } from "@/service/admin/author";
import {
  getPublishers,
  addPublisher as apiAddPublisher,
} from "@/service/admin/publisher";
import { getTags, addTag as apiAddTag } from "@/service/admin/tag";
import { getGenres, addGenre as apiAddGenre } from "@/service/admin/genre";
import {
  getDiscounts,
  addDiscount as apiAddDiscount,
} from "@/service/admin/discount";
import { addBook, updateBook } from "@/service/admin/book";
import Cookies from "js-cookie";
import { ImageUpload } from "./ImageUpload";
export default function BookForm({
  initialData,
  onSubmit,
  buttonText = "Сохранить",
  isEditMode = false,
}) {
  const token = Cookies.get("token");
  const emptyBook = {
    title: "",
    authorId: "",
    publisherId: "",
    discountId: "",
    description: "",
    imageUrl: "",
    price: "",
    stockQuantity: "",
    selectedGenres: [],
    selectedTags: [],
  };

  const [formData, setFormData] = useState(emptyBook);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  const [newAuthor, setNewAuthor] = useState({ name: "" });
  const [newPublisher, setNewPublisher] = useState({ name: "" });
  const [newGenre, setNewGenre] = useState({ name: "" });
  const [newTag, setNewTag] = useState({ name: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        const [
          authorsData,
          publishersData,
          genresData,
          tagsData,
          discountsData,
        ] = await Promise.all([
          getAuthors(token),
          getPublishers(token),
          getGenres(token),
          getTags(token),
          getDiscounts(token),
        ]);

        setAuthors(authorsData);
        setPublishers(publishersData);
        setGenres(genresData);
        setTags(tagsData);
        setDiscounts(discountsData);

        if (isEditMode && initialData) {
          const formattedData = {
            title: initialData.title || "",
            authorId: initialData.author?.authorId || "",
            publisherId: initialData.publisher?.publisherId || "",
            discountId: initialData.discount?.discountId || "",
            description: initialData.description || "",
            imageUrl: initialData.imageUrl || "",
            price: initialData.price || "",
            stockQuantity: initialData.stockQuantity || "",
            selectedGenres: initialData.bookGenres?.map((g) => g.genreId) || [],
            selectedTags: initialData.bookTags?.map((t) => t.tagId) || [],
          };
          setFormData(formattedData);
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [token, isEditMode, initialData]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Название книги обязательно";
    if (!formData.description.trim())
      newErrors.description = "Описание обязательно";
    if (!formData.price) newErrors.price = "Цена обязательна";
    if (formData.price && isNaN(Number(formData.price)))
      newErrors.price = "Цена должна быть числом";
    if (!formData.stockQuantity)
      newErrors.stockQuantity = "Количество в наличии обязательно";
    if (formData.stockQuantity && isNaN(Number(formData.stockQuantity)))
      newErrors.stockQuantity = "Количество должно быть числом";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData({ ...formData, imageUrl });
  };

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData({
      ...formData,
      selectedGenres: selectedOptions,
    });
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData({
      ...formData,
      selectedTags: selectedOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const bookData = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        authorId: formData.authorId ? Number(formData.authorId) : null,
        publisherId: formData.publisherId ? Number(formData.publisherId) : null,
        discountId: formData.discountId ? Number(formData.discountId) : null,
        genreIds: formData.selectedGenres || [],
        tagIds: formData.selectedTags || [],
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(bookData);
    } catch (error) {
      console.error("Ошибка при сохранении книги:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewAuthor = async () => {
    try {
      const createdAuthor = await apiAddAuthor(newAuthor, token);
      setAuthors([...authors, createdAuthor]);
      setFormData({ ...formData, authorId: createdAuthor.authorId });
      setShowAuthorModal(false);
      setNewAuthor({ name: "" });
    } catch (error) {
      console.error("Ошибка при добавлении автора:", error);
    }
  };

  const addNewPublisher = async () => {
    try {
      const createdPublisher = await apiAddPublisher(newPublisher, token);
      setPublishers([...publishers, createdPublisher]);
      setFormData({ ...formData, publisherId: createdPublisher.publisherId });
      setShowPublisherModal(false);
      setNewPublisher({ name: "" });
    } catch (error) {
      console.error("Ошибка при добавлении издателя:", error);
    }
  };

  const addNewDiscount = async () => {
    try {
      const createdDiscount = await apiAddDiscount(token, newDiscount);
      setDiscounts([...discounts, createdDiscount]);
      setFormData({ ...formData, discountId: createdDiscount.discountId });
      setShowDiscountModal(false);
      setNewDiscount({
        discountName: "",
        discountPercentage: "",
        discImage: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении скидки:", error);
    }
  };

  const addNewGenre = async () => {
    try {
      const createdGenre = await apiAddGenre(newGenre, token);
      setGenres([...genres, createdGenre]);
      setFormData({
        ...formData,
        selectedGenres: [...formData.selectedGenres, createdGenre.genreId],
      });
      setShowGenreModal(false);
      setNewGenre({ name: "" });
    } catch (error) {
      console.error("Ошибка при добавлении жанра:", error);
    }
  };

  const addNewTag = async () => {
    try {
      const createdTag = await apiAddTag(newTag, token);
      setTags([...tags, createdTag]);
      setFormData({
        ...formData,
        selectedTags: [...formData.selectedTags, createdTag.tagId],
      });
      setShowTagModal(false);
      setNewTag({ name: "" });
    } catch (error) {
      console.error("Ошибка при добавлении тега:", error);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode
          ? `Редактирование: ${formData.title || "книги"}`
          : "Добавить новую книгу"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Название книги <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Введите название книги"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="authorId"
              className="block text-sm font-medium text-gray-700"
            >
              Автор
            </label>
            <div className="flex space-x-2 mt-1">
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId || ""}
                onChange={handleSelectChange}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите автора</option>
                {authors.map((author) => (
                  <option key={author.authorId} value={author.authorId}>
                    {author.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAuthorModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Новый
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="publisherId"
              className="block text-sm font-medium text-gray-700"
            >
              Издатель
            </label>
            <div className="flex space-x-2 mt-1">
              <select
                id="publisherId"
                name="publisherId"
                value={formData.publisherId || ""}
                onChange={handleSelectChange}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите издателя</option>
                {publishers.map((publisher) => (
                  <option
                    key={publisher.publisherId}
                    value={publisher.publisherId}
                  >
                    {publisher.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowPublisherModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Новый
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="discountId"
              className="block text-sm font-medium text-gray-700"
            >
              Скидка
            </label>
            <select
              id="discountId"
              name="discountId"
              value={formData.discountId || ""}
              onChange={handleSelectChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Без скидки</option>
              {discounts.map((discount) => (
                <option key={discount.discountId} value={discount.discountId}>
                  {discount.discountName} ({discount.discountPercentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изображение книги
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={formData.imageUrl}
              />

              <div className="flex-1">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL изображения (или загрузите изображение)
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Цена (сом) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="stockQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Количество в наличии <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity || ""}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.stockQuantity ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="0"
            />
            {errors.stockQuantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stockQuantity}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="selectedGenres"
              className="block text-sm font-medium text-gray-700"
            >
              Жанры
            </label>
            <div className="flex space-x-2 mt-1">
              <select
                id="selectedGenres"
                name="selectedGenres"
                multiple
                value={formData.selectedGenres || []}
                onChange={handleGenreChange}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
              >
                {genres.map((genre) => (
                  <option key={genre.genreId} value={genre.genreId}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowGenreModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 self-start"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Новый
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Удерживайте Ctrl (или Command на Mac) для выбора нескольких жанров
            </p>
          </div>

          <div>
            <label
              htmlFor="selectedTags"
              className="block text-sm font-medium text-gray-700"
            >
              Теги
            </label>
            <div className="flex space-x-2 mt-1">
              <select
                id="selectedTags"
                name="selectedTags"
                multiple
                value={formData.selectedTags || []}
                onChange={handleTagChange}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
              >
                {tags.map((tag) => (
                  <option key={tag.tagId} value={tag.tagId}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowTagModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 self-start"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Новый
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Удерживайте Ctrl (или Command на Mac) для выбора нескольких тегов
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Описание <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            rows="4"
            placeholder="Введите описание книги"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Сохранение...
              </>
            ) : (
              <>{isEditMode ? "Обновить книгу" : "Добавить книгу"}</>
            )}
          </button>
        </div>
      </form>


      {showAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Добавить нового автора
              </h3>
              <button
                onClick={() => setShowAuthorModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя автора
              </label>
              <input
                type="text"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите имя автора"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                onClick={addNewAuthor}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {showPublisherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Добавить нового издателя
              </h3>
              <button
                onClick={() => setShowPublisherModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название издателя
              </label>
              <input
                type="text"
                value={newPublisher.name}
                onChange={(e) => setNewPublisher({ name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите название издателя"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPublisherModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                onClick={addNewPublisher}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {showGenreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Добавить новый жанр
              </h3>
              <button
                onClick={() => setShowGenreModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название жанра
              </label>
              <input
                type="text"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите название жанра"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGenreModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                onClick={addNewGenre}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Добавить новый тег
              </h3>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название тега
              </label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите название тега"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                onClick={addNewTag}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
